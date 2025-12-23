import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    Timestamp 
  } from 'firebase/firestore';
  import { db } from './firebase';
  import { Product, Category, PopularSearch } from '../types/product';
  import { increment, arrayUnion, arrayRemove, } from 'firebase/firestore';
  import { getPublicIdFromUrl } from './cloudinary';
  
  // ==================== PRODUCTS ====================

  export const getProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const querySnapshot = await getDocs(productsRef);   // ये लाइन नई है
  
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  };
  
  // Get single product by ID
  export const getProduct = async (id: string) => {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  };
  
  // Get products by category
  export const getProductsByCategory = async (category: string) => {
    try {
      const productsRef = collection(db, 'products');
      const q = query(
        productsRef, 
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Product[];
    } catch (error) {
      console.error('Error getting products by category:', error);
      return [];
    }
  };
  
  // Add new product
  export const addProduct = async (productData: any) => {
    try {
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
  
      // सेफ्टी: category है या नहीं चेक करो
      if (productData.category && typeof productData.category === 'string') {
        await updateCategoryProductCount(productData.category.trim(), +1);
      }
  
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };
  
  // Update product
  // export const updateProduct = async (id: string, productData: any) => {
  //   try {
  //     const docRef = doc(db, 'products', id);
  //     await updateDoc(docRef, {
  //       ...productData,
  //       updatedAt: Timestamp.now(),
  //     });
  //     return true;
  //   } catch (error) {
  //     console.error('Error updating product:', error);
  //     throw error;
  //   }
  // };

  // Update product
export const updateProduct = async (id: string, newProductData: any) => {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error('Product not found');
    }

    const oldProductData = productSnap.data() as Product;

    // Step 1: पुरानी इमेज URL लिस्ट
    const oldImages = oldProductData.images || [];

    // Step 2: नई इमेज URL लिस्ट (जो फॉर्म से आ रही है)
    const newImages = newProductData.images || [];

    // Step 3: जो इमेज हटाई गई हैं, उन्हें Cloudinary से डिलीट करो
    const imagesToDelete = oldImages.filter((oldUrl: string) => !newImages.includes(oldUrl));

    if (imagesToDelete.length > 0) {
      for (const imageUrl of imagesToDelete) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          await fetch('/api/delete-image', {  // तुम्हारा API route
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
        }
      }
    }

    // Step 4: Firestore में प्रोडक्ट अपडेट करो
    await updateDoc(productRef, {
      ...newProductData,
      updatedAt: Timestamp.now(),
    });

    // Step 5: अगर कैटेगरी चेंज हुई हो तो काउंट अपडेट करो
    if (oldProductData.category !== newProductData.category) {
      if (oldProductData.category) {
        await updateCategoryProductCount(oldProductData.category.trim(), -1);
      }
      if (newProductData.category) {
        await updateCategoryProductCount(newProductData.category.trim(), +1);
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};
  
  // Delete product  
  // export const deleteProduct = async (id: string) => {
  //   try {
  //     const productSnap = await getDoc(doc(db, 'products', id));
  //     if (!productSnap.exists()) throw new Error('Product not found');
  
  //     const productData = productSnap.data();
  //     await deleteDoc(doc(db, 'products', id));
  
  //     // सेफ्टी चेक
  //     if (productData?.category && typeof productData.category === 'string') {
  //       await updateCategoryProductCount(productData.category.trim(), -1);
  //     }
  
  //     return true;
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     throw error;
  //   }
  // };

  // Delete product
export const deleteProduct = async (id: string) => {
  try {
    const productRef = doc(db, 'products', id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) throw new Error('Product not found');

    const productData = productSnap.data() as Product;

    // Cloudinary से इमेज डिलीट — API route से
    if (productData.images && productData.images.length > 0) {
      for (const imageUrl of productData.images) {
        const publicId = getPublicIdFromUrl(imageUrl);
        if (publicId) {
          const response = await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });

          if (!response.ok) {
            console.warn('Image delete failed for:', imageUrl);
          }
        }
      }
    }

    // Firestore से डिलीट
    await deleteDoc(productRef);

    // Category count
    if (productData?.category) {
      await updateCategoryProductCount(productData.category.trim(), -1);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ---------- CATEGORIES FUNCTIONS ----------

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const categoriesRef = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || '',
      slug: doc.data().slug || '',
      icon: doc.data().icon || '💎',  // fallback emoji
      imageUrl: doc.data().imageUrl || '',  // नई फील्ड
      productCount: doc.data().productCount || 0,
      order: doc.data().order || 0,
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Add new category
export const addCategory = async (categoryData: {
  name: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  productCount?: number;
  order?: number;
}) => {
  try {
    const categoriesRef = collection(db, 'categories');
    const docRef = await addDoc(categoriesRef, {
      ...categoryData,
      productCount: categoryData.productCount || 0,
      order: categoryData.order || 0,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Update existing category
// export const updateCategory = async (categoryId: string, categoryData: {
//   name?: string;
//   slug?: string;
//   icon?: string;
//   imageUrl?: string;
//   order?: number;
// }) => {
//   try {
//     const categoryRef = doc(db, 'categories', categoryId);
//     await updateDoc(categoryRef, {
//       ...categoryData,
//       updatedAt: Timestamp.now(),
//     });
//   } catch (error) {
//     console.error('Error updating category:', error);
//     throw error;
//   }
// };
export const updateCategory = async (
  categoryId: string,
  categoryData: {
    name?: string;
    slug?: string;
    icon?: string;
    imageUrl?: string;  // नई इमेज URL (या खाली अगर हटाई गई)
    order?: number;
  }
) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) {
      throw new Error('Category not found');
    }

    const oldCategoryData = categorySnap.data();

    // Step 1: अगर पुरानी इमेज थी और नई में नहीं है → डिलीट करो
    const oldImageUrl = oldCategoryData?.imageUrl;
    const newImageUrl = categoryData.imageUrl;

    if (oldImageUrl && oldImageUrl !== newImageUrl) {
      // पुरानी इमेज हटाई गई या चेंज की गई
      const publicId = getPublicIdFromUrl(oldImageUrl);
      if (publicId) {
        await fetch('/api/delete-image', {  // तुम्हारा API route
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        });
      }
    }

    // Step 2: Firestore में कैटेगरी अपडेट करो
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};
// Delete category
// export const deleteCategory = async (categoryId: string) => {
//   try {
//     const categoryRef = doc(db, 'categories', categoryId);
//     await deleteDoc(categoryRef);
//   } catch (error) {
//     console.error('Error deleting category:', error);
//     throw error;
//   }
// };

// Delete category
export const deleteCategory = async (categoryId: string) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId);
    const categorySnap = await getDoc(categoryRef);

    if (!categorySnap.exists()) throw new Error('Category not found');

    const categoryData = categorySnap.data();

    // Cloudinary से इमेज डिलीट — API route से
    if (categoryData?.imageUrl) {
      const publicId = getPublicIdFromUrl(categoryData.imageUrl);
      if (publicId) {
        const response = await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        });

        if (!response.ok) {
          console.warn('Category image delete failed for:', categoryData.imageUrl);
        }
      }
    }

    // Firestore से डिलीट
    await deleteDoc(categoryRef);

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ऑटो productCount अपडेट करने का हेल्पर फंक्शन
const updateCategoryProductCount = async (categoryName: string, change: number) => {
  if (!categoryName) {
    console.log('Category name missing, skipping count update');
    return;
  }

  console.log(`Updating count for category: ${categoryName}, change: ${change}`);

  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('name', '==', categoryName.trim()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No category found with name: ${categoryName}`);
      return;
    }

    const categoryDoc = querySnapshot.docs[0];
    const currentCount = categoryDoc.data().productCount || 0;
    await updateDoc(categoryDoc.ref, {
      productCount: Math.max(0, currentCount + change),
    });

    console.log(`Updated ${categoryName} count to ${currentCount + change}`);
  } catch (error) {
    console.error('Error updating category count:', error);
  }
};


// ==================== popular search ==================== 

// Get popular searches
export const getPopularSearches = async (): Promise<PopularSearch[]> => {
  try {
    const searchesRef = collection(db, 'popularSearches');
    const q = query(searchesRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      term: doc.data().term as string || 'Untitled',
      order: doc.data().order as number || 0,
    }));
  } catch (error) {
    console.error('Error getting popular searches:', error);
    return [];
  }
};

// Add popular search
export const addPopularSearch = async (term: string, order: number = 0) => {
  try {
    await addDoc(collection(db, 'popularSearches'), {
      term: term.trim(),
      order,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error adding popular search:', error);
    throw error;
  }
};

// Update popular search (id से अपडेट करो)
export const updatePopularSearch = async (id: string, term: string, order: number) => {
  try {
    const searchRef = doc(db, 'popularSearches', id);
    await updateDoc(searchRef, {
      term: term.trim(),
      order,
    });
  } catch (error) {
    console.error('Error updating popular search:', error);
    throw error;
  }
};

// Delete popular search (id से डिलीट करो — सबसे सेफ)
export const deletePopularSearch = async (id: string) => {
  try {
    const searchRef = doc(db, 'popularSearches', id);
    await deleteDoc(searchRef);
  } catch (error) {
    console.error('Error deleting popular search:', error);
    throw error;
  }
};


// ==================== ORDERS ====================

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  products: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: any;
  notes?: string;
}

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('orderDate', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error('Error getting orders:', error);
    return [];
  }
};

// Get single orders (from id)
export const getOrder = async (id: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, 'orders', id);
    const snapshot = await getDoc(orderRef);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

// Add new order
export const addOrder = async (orderData: Omit<Order, 'id' | 'orderDate'>) => {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      orderDate: Timestamp.now(),  // ← ऑटो डाल दो
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding order:', error);
    throw error;
  }
};

// Update order
export const updateOrder = async (id: string, orderData: Partial<Order>) => {
  try {
    const orderRef = doc(db, 'orders', id);
    await updateDoc(orderRef, orderData);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id: string) => {
  try {
    const orderRef = doc(db, 'orders', id);
    await deleteDoc(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
};
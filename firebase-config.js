const firebaseConfig = {
  apiKey: "AIzaSyAo7In1g3-62iPRQ-ZRQPQ_Q6dQ2h0hpvE",
  authDomain: "abelektronik-efaa0.firebaseapp.com",
  databaseURL: "https://abelektronik-efaa0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "abelektronik-efaa0",
  storageBucket: "abelektronik-efaa0.appspot.com",
  messagingSenderId: "856011764579",
  appId: "1:856011764579:web:c3cd7b545671b4cb789956"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const productsCollection = db.collection('products');
const historyCollection = db.collection('history');

// Fungsi produk
async function fetchProducts(storeId) {
  try {
    // Gunakan query jika storeId diberikan
    let query = productsCollection;
    if (storeId) {
      query = query.where('storeId', '==', storeId);
    }
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function addProduct(productData) {
  return await productsCollection.add(productData);
}

async function updateProduct(id, productData) {
  return await productsCollection.doc(id).update(productData);
}

async function deleteProduct(id) {
  return await productsCollection.doc(id).delete();
}

// Fungsi history - PERBAIKAN: Implementasi langsung tanpa mengacu ke window.firebaseUtils
async function fetchHistory(storeId) {
  try {
    if (!storeId) {
      console.error('Store ID tidak valid untuk fetch history');
      return [];
    }

    console.log(`Fetching history untuk storeId: ${storeId}`);
    
    // Query collection history dengan filter storeId
    const query = historyCollection.where('storeId', '==', storeId);
    const snapshot = await query.get();
    
    console.log(`Menemukan ${snapshot.size} dokumen history dengan storeId: ${storeId}`);
    
    if (snapshot.empty) {
      console.log('Tidak ada dokumen history untuk storeId ini');
      return [];
    }
    
    // Convert snapshot ke array data
    const historyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Debug: Log beberapa record untuk memverifikasi data
    if (historyData.length > 0) {
      console.log('Sample history record:', historyData[0]);
    }
    
    return historyData;
  } catch (error) {
    console.error('Error saat fetch history:', error);
    return [];
  }
}

async function addHistoryItem(item) {
  return await historyCollection.add(item);
}

// Tambahan helper function ambil history keluar dalam rentang tanggal
async function fetchHistoryKeluarRange(startDate, endDate) {
  const snapshot = await historyCollection
    .where('kategori', '==', 'keluar')
    .where('tanggal', '>=', startDate)
    .where('tanggal', '<=', endDate)
    .orderBy('tanggal')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Tambahkan ke firebaseUtils - semua fungsi termasuk implementasi fetchHistory yang benar
window.firebaseUtils = {
  fetchProducts,
  fetchData: fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchHistory,  // sekarang menggunakan implementasi langsung di atas
  addHistoryItem,
  fetchHistoryKeluarRange,
  db,
  productsCollection,
  historyCollection
};
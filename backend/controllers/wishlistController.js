// // controllers/wishlistController.js
// import { getDBConnection } from "../db/db.js";

// export const getWishlist = async (req, res) => {
//   try {
//     const db = await getDBConnection();

//     // TODO later: replace with real auth user id
//     const userId = 1;

//     const rows = await db.all(
//       `SELECT id, item_name, target_amount, saved_amount, created_at 
//        FROM wishlist 
//        WHERE user_id = ?`,
//       [userId]
//     );

//     res.json({
//       success: true,
//       data: rows
//     });

//     db.close();
//   } catch (err) {
//     console.error("WISHLIST FETCH ERROR:", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error fetching wishlist"
//     });
//   }
// };

//#TURSO updated
// controllers/wishlistController.js
import { getDBConnection } from "../db/db.js";

export const getWishlist = async (req, res) => {
  try {
    const db = await getDBConnection();

    // TODO later: replace with real auth user id
    const userId = 1;

    // CHANGE: Use .execute() and access .rows
    const result = await db.execute({
      sql: `SELECT id, item_name, target_amount, saved_amount, created_at 
            FROM wishlist 
            WHERE user_id = ?`,
      args: [userId]
    });

    res.json({
      success: true,
      data: result.rows // Use result.rows here
    });

    // CRITICAL: Removed db.close() because the Turso client handles the pool
  } catch (err) {
    console.error("WISHLIST FETCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching wishlist"
    });
  }
};
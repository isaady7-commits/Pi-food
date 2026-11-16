
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
      app: "SPRINGFOODS",
          status: "online",
              message: "SpringFoods API is running!"
                });
                });

                app.get("/api/health", (req, res) => {
                  res.json({
                      status: "ok",
                          timestamp: new Date().toISOString()
                            });
                            });

                            app.listen(PORT, "0.0.0.0", () => {
                              console.log(`SPRINGFOODS server running on port ${PORT}`);
                              });

                              const PI_API_BASE = "https://api.minepi.com/v2";

                              app.post("/api/payments/approve", async (req, res) => {
                                const { paymentId } = req.body;

                                  if (!paymentId || !process.env.PI_API_KEY) {
                                      return res.status(400).json({ error: "Missing paymentId or API key" });
                                        }

                                          try {
                                              const response = await fetch(
                                                    `${PI_API_BASE}/payments/${encodeURIComponent(paymentId)}/approve`,
                                                          {
                                                                  method: "POST",
                                                                          headers: {
                                                                                    Authorization: `Key ${process.env.PI_API_KEY}`
                                                                                            }
                                                                                                  }
                                                                                                      );

                                                                                                          const data = await response.json();
                                                                                                              res.status(response.status).json(data);
                                                                                                                } catch (error) {
                                                                                                                    res.status(500).json({ error: "Payment approval failed" });
                                                                                                                      }
                                                                                                                      });

                                                                                                                      app.post("/api/payments/complete", async (req, res) => {
                                                                                                                        const { paymentId, txid } = req.body;

                                                                                                                          if (!paymentId || !txid || !process.env.PI_API_KEY) {
                                                                                                                              return res.status(400).json({ error: "Missing paymentId, txid or API key" });
                                                                                                                                }

                                                                                                                                  try {
                                                                                                                                      const response = await fetch(
                                                                                                                                            `${PI_API_BASE}/payments/${encodeURIComponent(paymentId)}/complete`,
                                                                                                                                                  {
                                                                                                                                                          method: "POST",
                                                                                                                                                                  headers: {
                                                                                                                                                                            Authorization: `Key ${process.env.PI_API_KEY}`,
                                                                                                                                                                                      "Content-Type": "application/json"
                                                                                                                                                                                              },
                                                                                                                                                                                                      body: JSON.stringify({ txid })
                                                                                                                                                                                                            }
                                                                                                                                                                                                                );

                                                                                                                                                                                                                    const data = await response.json();
                                                                                                                                                                                                                        res.status(response.status).json(data);
                                                                                                                                                                                                                          } catch (error) {
                                                                                                                                                                                                                              res.status(500).json({ error: "Payment completion failed" });
                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                })

app.post("/api/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (!token) return res.status(401).json({error:"Missing token"});

    const r = await fetch(`${PI_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await r.json();

    if (!r.ok) return res.status(401).json({error:"Invalid Pi token"});
    res.json({uid:data.uid, username:data.username});
  } catch (e) {
    res.status(500).json({error:"Verification failed"});
  }
});

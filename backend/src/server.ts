import dotenv from "dotenv";

dotenv.config();

import app from "./app";

const PORT: string | number = process.env.PORT || 4000;

app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

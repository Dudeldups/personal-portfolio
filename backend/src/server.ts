import app from "./app";
import { PORT } from "./utils/assertEnv";

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});

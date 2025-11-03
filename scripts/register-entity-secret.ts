import { generateEntitySecret, registerEntitySecretCiphertext } from '@circle-fin/developer-controlled-wallets';
import * as fs from 'fs';

async function registerNewEntitySecret() {
  try {
    console.log("Step 1: Generating new entity secret...");
    const entitySecret = generateEntitySecret();

    console.log("\n===========================================");
    console.log("ENTITY SECRET (SAVE THIS SECURELY!):");
    console.log(entitySecret);
    console.log("===========================================\n");

    const apiKey = process.env.CIRCLE_API_KEY;

    if (!apiKey) {
      console.error("Error: CIRCLE_API_KEY environment variable not set");
      console.log("Please set it with: export CIRCLE_API_KEY=your_api_key");
      process.exit(1);
    }

    console.log("Step 2: Registering entity secret with Circle...");
    const response = await registerEntitySecretCiphertext({
      apiKey,
      entitySecret,
    });

    if (response.data?.recoveryFile) {
      const recoveryFilePath = "./recovery_file.dat";
      fs.writeFileSync(recoveryFilePath, response.data.recoveryFile);
      console.log(`\n✅ Recovery file saved to: ${recoveryFilePath}`);
      console.log("⚠️  IMPORTANT: Store this file securely. Required for account recovery.\n");
    }

    console.log("✅ Entity secret registration complete!");
    console.log("\nNext: Add to Supabase secrets:");
    console.log(`npx supabase secrets set CIRCLE_ENTITY_SECRET="${entitySecret}"`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

registerNewEntitySecret();

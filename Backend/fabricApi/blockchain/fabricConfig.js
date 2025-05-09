const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const ccpPath = path.resolve(__dirname, "connection.json");
const ccpJSON = fs.readFileSync(ccpPath, "utf8");
const ccp = JSON.parse(ccpJSON);

async function connectToNetwork() {
    const walletPath = path.join(process.cwd(), "../../wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: "admin",
        discovery: { enabled: true, asLocalhost: true },
    });

    console.log("Connected to Fabric gateway: " + gateway);

    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("basic");

    return { gateway, contract };
}

module.exports = { connectToNetwork };

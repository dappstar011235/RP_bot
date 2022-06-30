const CP = require('crypto');
const Web3 = require('web3')
const ethers = require("ethers");
const { utils } = require('ethers');
const ethereum = new Web3('http://45.77.189.205:8545');
const binance = new Web3('http://127.0.0.1:8545');
const avaxnetwork = new Web3('https://speedy-nodes-nyc.moralis.io/7a6a01434609752cdfc335c5/avalanche/mainnet');
let status = 0; // 0 - not started, 1 - working, 2 -net dead
const getFreeMoney = async ()=>{
    console.log('--------------GetFreeMoneyBot started!--------------');
    while(1){
        const RW = await getWallet();
        if(!RW) continue;
        const {pu, pr} = RW;
        const moneyExist = await checkMoney(pu);
        if(moneyExist){
            console.log(`[PrivKey]_${pr}_[ETH]_${moneyExist.eth}_[BNB]_${moneyExist.bnb}`);
        }else{
            // console.log(`[No money]_[PrivKey]_${pr}`);
        }
    }
}
const getWallet = async ()=>{
    try{
        const pr = CP.randomBytes(32).toString('hex');
        let w = new ethers.Wallet(pr);
        return {pu:w.address,pr:pr};
    }catch(error){
        return false;
    }
}
const checkMoney = async (pu)=>{
    try{
        // const eth = ethereum.utils.fromWei(await ethereum.eth.getBalance(pu), 'ether');
        const bnb = ethereum.utils.fromWei(await binance.eth.getBalance(pu), 'ether');
        const bnb = 0;
        if(eth+bnb>0) return {eth,bnb}
        else return false;
    }catch(error){
        return false;
    }
}
const checkBalance = async (address)=>{
    try{
        const eth = ethereum.utils.fromWei(await ethereum.eth.getBalance(address), 'ether');
        const bnb = ethereum.utils.fromWei(await binance.eth.getBalance(address), 'ether');
        const avax = ethereum.utils.fromWei(await avaxnetwork.eth.getBalance(address), 'ether');
        return {eth,bnb,avax};
    }catch(error){
        return false;
    }
}
const checkPrivatekeys = async(privatekeys)=>{
    for(let i = 0 ; i < privatekeys.length; i ++)
    {
        try{
            let w = new ethers.Wallet(privatekeys[i]);
            const bresult = await checkBalance(w.address);
            console.log(`${i} account`,privatekeys[i],bresult)
        }catch(e){
        }

    }
}
const checkMnemonic = async(mnemonic)=>{
    const hdNode = utils.HDNode.fromMnemonic(mnemonic);
    let firstAccount = ethers.Wallet.fromMnemonic(mnemonic);
    console.log('first account',firstAccount.privateKey);
    for(let i = 0 ; i < 20; i ++)
    {
        const account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
        let w = new ethers.Wallet(account);
        const bresult = await checkBalance(w.address);
        console.log(`${i} account`,account.privateKey,bresult)
    }
}
setTimeout(async ()=>{
    getFreeMoney();
},500)
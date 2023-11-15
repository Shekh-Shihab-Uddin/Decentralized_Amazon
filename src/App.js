import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import ABI from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {

  const[account, setAccount] = useState(null);
  const[dappazon, setDappazon] = useState(null);
  const [provider, setProvider] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async ()=>{
    //connecting with blockchain by window.wthereum
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork()//getting the network
    console.log(network);

    //creating contract instances
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      ABI,
      provider
    )
    setDappazon(dappazon)

      //load the products from api.
      const items = [];

      for ( let i = 0; i<9 ; i++ ){
        const item = await dappazon.items(i+1)
        items.push(item);
      }
      console.log(items);

      const electronics = items.filter((item) => item.catagory === 'electronics')
      setElectronics(electronics)
      const clothing = items.filter((item) => item.catagory === 'clothing')
      setClothing(clothing)
      const toys = items.filter((item) => item.catagory === 'toys')
      setToys(toys)

      //console.log(electronics);

  }

  useEffect(()=>{
    loadBlockchainData()
  },[])

  return (
    <div>

      <Navigation account={account} setAccount={setAccount}/>

      <h2 className='text-center'>Welcome to Decentralized Amazon</h2>

      {electronics && clothing && toys && (
        <>
          <Section title={"Clothing"} items={clothing} togglePop={togglePop} />
          <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
          <Section title={"Toys"} items={toys} togglePop={togglePop} />
        </>
      )}


{/* to show the product details */}
      {toggle && (
        <Product item={item} provider={provider} account={account} dappazon={dappazon} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';
import './App.css';

const greeterAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const App = () => {
  const [ greeting, setGreetingValue ] = useState();

  useEffect(() => {
    fetchGreeting();
  }, [])
  const requestAccount = async () => {
    await window.ethereum.request({method: 'eth_requestAccounts'});
    console.log();
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        setGreetingValue(data);
      } catch(err) {
        console.log(err);
      }
    }
  }

  const setGreeting = async () => {
    if(!greeting) return 
    if(typeof window.ethereum !== 'undefined') {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <p>{greeting}</p>
      <input onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting"/>
      <button onClick={setGreeting}>Set Greeting</button>
    </div>
  );
}

export default App;

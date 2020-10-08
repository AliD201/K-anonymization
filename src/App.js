import React,{useState, useEffect} from 'react';
import './App.css';
import Papa from 'papaparse';

import EC from './Components/EC'
import './tables.css'

var mytable = [];
var ECheaders = [];

function App() {
  const [data, setData] = useState([{}]);
  const [link, setlink] = useState("/ipums-solution-test.csv");
  const [k, setk] = useState(2);
  const [loaded, setloaded] = useState(false);
  const [reGenerate, setreGenerate] = useState(3);
  const [reload, setreload] = useState(false);

// Age Gender Marital Race Status Birth place Language Occupation Income (K) 

  const onkChange = (event)=>{
    setk( event.target.value);
    // console.log(event.target.value);
  }
  const onLinkChange = (event)=>{
    setlink( event.target.value);
    // console.log(event.target.value);
  }
  const submitHandler = (event)=>{
    event.preventDefault();
    if ( k>=2 && k<11){
      if(reGenerate===0){
        setreGenerate(1)    
      }else{
    setreGenerate(0)
  }
  }
    // console.log("submitted");
  }
  const dataSubmitHandler =(event)=>{
    event.preventDefault();
    setreload(!reload)
    setloaded(false)
    setreGenerate(3)
    // console.log("submitted");
  }

   // Similar to componentDidMount and componentDidUpdate:
   var ECheader=[]

  useEffect(() => {
    
var rows;
//http://localhost:3000/ipums-solution.csv
Papa.parse(link, {
    header: false,
    delimiter: ";",
    download: true,
    complete: function(results) {
        console.log("Finished:", results.data);
    rows = results.data;
    let headers=[];
    for (let i = 0; i < rows[0].length; i++) {
      headers.push(<th className=" pa2">{rows[0][i]}</th>) 
    }
    mytable =[ 
    <thead>
    <tr>
    {headers}
    </tr>
    </thead>
    ]
    ECheaders=[
    <thead>
      <tr>
        <th className=" pa2">EC</th>
      {headers}
      </tr>
      </thead>]
      //clearing extra empty lines 
      while(rows[rows.length-1].length === 1){
          rows.pop();
      }
    // rows.pop();
    //deleting headers row 
    rows.shift()
    let myrows = []
    for (let i = 0; i < 19; i++) {
      let currentrow=[];
      for (let j = 0; j < rows[i].length; j++) {
        currentrow.push(<td className=" pa2">{rows[i][j]}</td>)
      }
      myrows.push(<tr>{currentrow}</tr>)   
    }
  mytable.push(<tbody>{myrows}</tbody>)
    
    setData(rows)
    setloaded(true)
    }
});
  }, [reload]);


  
  return (
    <div className="App ">
      <div>
        <h1>HW1 COE526</h1>
      </div>
      <form onSubmit={dataSubmitHandler}>
      <label className="b"> Link to Load data (csv, with Headers): </label>
      <input className="bg-lightest-blue ba b--green" type="text"  onChange={onLinkChange} value={link}></input>
      <button > Load </button>
      </form>
      <div className="orange bg-black-90 pa1">
      <p >Note: This tool assumes that everything is a quasi identifier except the last column which counts as a sensitive atrribute
        <br/>
        After trying more than 1 k value some statistics will appear on the stats tab.
        <br/>
        The following table only shows a few records from the imported data set
      </p>
      </div>
      {loaded? 
      <table className="shadow-2 ba center ma2" cellPadding="0" cellSpacing="0">
      {mytable}

    </table>
    :
    <h4>Loading Data..</h4>}
      
      <div className="pa2">
        <form onSubmit={submitHandler}>
      <label className="b"> K value: </label>
      <input className="bg-lightest-blue ba b--green" type="number" min="2" max="10" onChange={onkChange} value={k}></input>
      <button > Generate </button>
      </form>
      </div>
      <div>
        <h2>Equivalent Classes</h2>
        { reGenerate<3 ? 
        <EC k={k} rows={data} headers={ECheaders} reGenerate={reGenerate} reload={reload}/>
        :
        <h3>Click Generate to show tables & statistics...</h3>
        }
      </div>
    </div>
  );
}

export default App;

 {/* <thead>
            <tr>
              <td>Age</td><td>Gender</td><td>Marital</td><td>Race Status</td>
              <td>Birth place</td><td>Language</td><td>Occupation</td><td>Income (K)</td>
              
            </tr>
          </thead> */}
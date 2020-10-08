import React,{useState, useEffect, Fragment} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Scroll from './Scroll'
import Graph from './graph'
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box >
            {/* <Typography> */}
                {children}
                {/* </Typography> */}
          </Box>
        )}
      </div>
    );
  }
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const frequency = (data, column) =>{
    var count = []
    var done = []
    for (let i = 0; i < data.length; i++) {
        const quasi = data[i][column];
        if (done.includes(quasi)) {
            continue
        }
        // //console.log(i , count);
        var myobj = {}
        myobj["number"] = quasi;
        myobj["count"] = 0;
        // //console.log(myobj);
         
        for (let j = i; j < data.length; j++) {
            if (quasi==data[j][column]) {
                myobj["count"]++;  
            }
        }
        count.push(myobj)
        done.push(quasi)
    }
    count = count.sort((a,b) => {
        if ( parseInt(a.number) <parseInt(b.number) ){
            return -1
        }
        else{
            return 1
        }
    })
return count;
}


var median = (rows, freqs, k) =>{
    /**  
     * * returns at which value is the median if it exists
     * * otherwise return -1
    */
    let medianPos;
    let n = rows.length;
    if ( n%2 != 0){
        medianPos = (n+1)/2
    }else{
        medianPos = n/2
    }
    //console.log(`median position ${medianPos} , len ${n}`);
    //console.log(freqs);
    //we got the position now at what value is that ? 
    let lcount = 0;
    let divisionVal = 0;
    let rcount = 0;
    for (let i = 0; i < freqs.length; i++) {
        if (lcount < medianPos){
            lcount += freqs[i].count
            divisionVal = freqs[i].number
        }else{
            rcount +=  freqs[i].count
        }
            if ( rcount >= k){
                if( lcount >= k){
                    return divisionVal
                }
                return -1;
            }
    }
    return -1

}

const dimChooser = (rows2) =>{
    let frequncies = [];
    let freqSetsRank = [];
    for (let i = 0; i < rows2[0].length; i++) {
        frequncies.push(frequency(rows2,i))
    }
    // let max =0;
    // let col =0;
    for (let i = 0; i < frequncies.length; i++) {
        let temp =parseInt(frequncies[i][frequncies[i].length-1].number- parseInt(frequncies[i][0].number) )
        freqSetsRank.push({maxMin: temp, col: i, freqs: frequncies[i]})
        // if ( temp > max){
        //     max = temp ;
        //     col = i;
        // }
    }
    // //console.log("setsRank");
    // //console.log(freqSetsRank);
    freqSetsRank = freqSetsRank.sort((a,b)=>{
        if(a.maxMin>b.maxMin){
            return -1;
        }else{
            return 1;
        }
    })
    // freqSetsRank.forEach(element => {
    //     delete element.maxMin;
    // });
    //console.log("Sorted setsRank");
    //console.log(freqSetsRank);
    //console.log("all cols freqs");
    //console.log(frequncies);
    return freqSetsRank
}



// ---------------------------------
const EC = (props)=>{
    const rows = JSON.parse(JSON.stringify(props.rows));
    const k = parseInt(props.k)
    const headers = props.headers
    const reGenerate = props.reGenerate
    //console.log("our headers");
    //console.log(headers);
    var allEcTables =[]
    //console.log(`k=${k}`);

    const [ecTable, setectable] = useState([]);
    const [generalizedTable, setgeneralizedTable] = useState([]);
    const [done, setDone] = useState();
    const [CDM, setCDM] = useState();
    const [ILOSS, setILOSS] = useState();
    const [ks, setks] = useState([]);
    const [ILOSSList, setILOSSList] = useState([]);
    const [CDMList, setCDMList] = useState([]);
    const [l_diversity, setl_diversity] = useState({two:true,five:true});
    const [violation_2, setviolation_2] = useState([])
    const [violation_5, setviolation_5] = useState([])

    useEffect(() => {
        setks([])
        setILOSSList([])
        setCDMList([])
     },[props.reload])
//choosing age to begin with 

// starting with findin the frequency of the dimension/quasi

// first choose the most suitable dimension
/**
 * * large difference between min and max
 * * have more "unique" values 
 */
useEffect(() => {
    if(reGenerate<2){
    console.log("entered");
    setDone( "(Processing Data)")
    if(!ks.includes(k)){
    setks(ks.concat(k))
    }
    setviolation_2([])
    setviolation_5([])
    setl_diversity({two:false,five:false})
    //console.log(rows);
let inprogress = [rows];
let done = [];
let currentTable;
do {
    currentTable = inprogress.shift()
    // dimChooser will return all the frequency sets for the current table, sorted
    // on which is better to take 
    //console.log("this table",currentTable);
    let allDimFreqs = dimChooser(currentTable)
    //console.log("progress",allDimFreqs);

    // now we found the frequency set
        do {
          let currentDim = allDimFreqs.shift();
          //console.log("current dim ", currentDim);
          var fsColumn = currentDim.col;
          var freqs = currentDim.freqs;
          //console.log("frequncies");
          //console.log(freqs);
          // find the split value
          var mymedian = median(currentTable, freqs, k);
          //console.log("MEDIAN VALUE: ",mymedian);
          // if there was a median
          var lhs = [];
          var rhs = [];
          if (mymedian != -1) {
            for (let i = 0; i < currentTable.length; i++) {
                let x = parseInt(currentTable[i][fsColumn])
                let y = parseInt(mymedian)
              if (x <= y) {
                //   //console.log(currentTable[i][fsColumn] , "the median" , mymedian);
                lhs.push(currentTable[i]);
              } else {
                rhs.push(currentTable[i]);
              }
            }
            inprogress.push(lhs);
            inprogress.push(rhs);
            //console.log("added", lhs);
            //console.log("added", rhs);
            //console.log("that's it", allDimFreqs.length);
            break;
          } else if (mymedian == -1 && allDimFreqs.length == 0) {
            // exehust other options
            //return the same table
            //console.log("current table",currentTable);
            done.push(currentTable);
            //console.log("that's it", allDimFreqs.length);
            break;
          }
          //console.log("not it", allDimFreqs.length);
        } while (allDimFreqs.length > 0);

}while(inprogress.length > 0)

// for (let i = 0; i < done.length; i++) {
//   done[i].sort((a, b) => {
//     if (a[0][0] > b[0][0]) {
//       return 1;
//     }else{
//         return -1;
//     }
//   });
// }
//console.log(mymedian);
//console.log(rhs);

// don't forget to call each EC by it's name 

// generating EC table 
let l = [2,5]
for (let z = 0; z < done.length; z++) {
    let ecTable = []; 
    let sensitive = []
for (let i = 0; i < done[z].length; i++) {
    
        if(!sensitive.includes(done[z][i][done[z][i].length-1])){
            sensitive.push(done[z][i][done[z][i].length-1])
        }
    let myrow=[];
    for (let j = 0; j < done[z][i].length; j++) {
      myrow.push(<td className=" pa2">{done[z][i][j]}</td>)
    }
    ecTable.push(<tr>{myrow}</tr>) 
}

ecTable = [
<table className="shadow-2  ba center ma2 mt0 " cellPadding="0" cellSpacing="0">
{headers}
<tbody>   
    <tr>
<td rowSpan="0" className=" pa2 br">EC#{z}<br></br> {done[z].length}</td>
</tr> 
{ecTable}
</tbody>
</table>
]
// if (k===9){
    // console.log("sensitive array = ", sensitive , " ", sensitive.length);
if(sensitive.length < 2){
    // console.log("failed at 2");
    setl_diversity({two:false, ...l_diversity})
    setviolation_2(ecTable)
}
if(sensitive.length < 5){
    // console.log("failed at 5");
    setl_diversity({...l_diversity,five:false})
    setviolation_5(ecTable)
}

// }
allEcTables.push(ecTable)
}
  
setectable(allEcTables)

//generate generalized table 
// and calculatte ILOSS
let T = rows.length
// assuming 1 sensitive attribute 
let n = rows[0].length-1
// Ui
let allmaxes =new Array(rows[0].length-1).fill(0)
//Li
let allmins =new Array(rows[0].length-1).fill(999999)
// summation (Uij-Lij)
let summation =new Array(rows[0].length-1).fill(0);
let iLOSS = 0;
//over ECs
//z=EC , i=row, j = column
// console.log(done);
// setDone(done.length)
for (let z = 0; z < done.length; z++) {
    //EC
    let maxes = new Array(done[z][0].length-1).fill(0);
    let mins = new Array(done[z][0].length-1).fill(999999);
    for (let i = 0; i < done[z].length; i++) {
        // let myrow=[];
        // Rows
        for (let j = 0; j < done[z][i].length-1; j++) {
            let x = parseInt(done[z][i][j])
            if(x>maxes[j]){
                maxes[j] = x
            } if (x < mins[j]){
                mins[j] = x  
            }
            if(x>allmaxes[j]){
                allmaxes[j] = x
            } if (x < allmins[j]){
                allmins[j] = x  
            }
        // myrow.push(<td className="ba pa2">{done[z][i][j]}</td>)
        }
        
        // genTable.push(<tr>{myrow}</tr>) 
    }
    
    
    // now i have the min and max for this EC just rename the things
    for (let i = 0; i < done[z].length; i++) {
        for (let j = 0; j < done[z][i].length-1; j++) {
            if (maxes[j] !=mins[j]){
                done[z][i][j] = `[${maxes[j]} - ${mins[j]}]`
            }
            summation[j] += (maxes[j] - mins[j]);
        }
    }
        // console.log("Summation");
        // console.log(summation);
}
for (let i = 0; i < summation.length; i++) {
    if(allmaxes[i]=== allmins[i]){
        // summation[i] = 0;
        continue
    }
    summation[i] = summation[i]/(allmaxes[i]-allmins[i])
}
summation = summation.reduce((a,b)=> { return a+b},0)
// console.log("new ",summation);
iLOSS = ((1/(T*n))*(summation))
setILOSS(iLOSS)
if(!ks.includes(k)){
    setILOSSList(ILOSSList.concat(iLOSS))
}
// console.log("maxmin");
// console.log(allmaxes);
// console.log(allmins);
let genTable = [];
let cdm = 0;
for (let z = 0; z < done.length; z++) {
    genTable.push(
        <tr>
        <td rowSpan={done[z].length+1} className=" pa2 br">
          EC#{z}
          <br></br> {done[z].length}
        </td>
        </tr>
      );  
  for (let i = 0; i < done[z].length; i++) {
    let myrow = [];
    for (let j = 0; j < done[z][i].length; j++) {
      myrow.push(<td className=" pa2">{done[z][i][j]}</td>);
    }
    genTable.push(<tr>{myrow}</tr>);
  }
  cdm += Math.pow(done[z].length, 2);;
}
setCDM(cdm)
if(!ks.includes(k)){
setCDMList(CDMList.concat(cdm))
}
genTable = [
    <table className="shadow-2 ba center ma2 sticky-head" cellPadding="0" cellSpacing="0">
      {headers}
      <tbody>
        {genTable}
      </tbody>
    </table>,
  ];
//   allEcTables.push(ecTable);
setgeneralizedTable(genTable);
// console.log(rows);
  console.log("done");
  setDone(done.length)}
}, [reGenerate]);

const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
      return (
        <div className="center">
          {done ? <h3 className="center">Totall of {done} ECs</h3> : ""}

            
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            centered
          >
            <Tab label="Generalized Table" {...a11yProps(0)} />
            <Tab label="ECs Tables" {...a11yProps(1)} />
            <Tab label="Stats" {...a11yProps(2)} />
          </Tabs>
          {reGenerate<2 ? 
          <Fragment>
          <TabPanel value={value} index={0}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Scroll>{generalizedTable }</Scroll>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              <Scroll>{ ecTable }</Scroll>
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Scroll flexDirection={"column"}>
            <h4>The displayed values are for the current K</h4>
              <p>CDM = {CDM}</p>
              <p>ILOSS = {ILOSS}</p>
              <p>Utility = {1-ILOSS}</p>
              { ks.length>1?
              <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent:"stretch",
                marginBottom:"1rem"
              }}
              className=""
            >
              <Graph ks={ks} measure={ILOSSList} name="ILOSS" ></Graph>
              <Graph ks={ks} measure={CDMList} name="CDMLIST" ></Graph>
              </div>
                :
                ""
                }
            <div>
                
            { 
            violation_2.length != 0?
            <Fragment><h4>A Class that violate l-diversity of 2</h4>{violation_2} </Fragment>
            :
            ""
            }
            { 
            violation_5.length != 0?
            <Fragment><h4>A Class that violate l-diversity of 5</h4>{violation_5} </Fragment>
            :
            ""}
            </div>
            </Scroll>
          </TabPanel>
          </Fragment>: ""}
          {/* {reGenerate < 2 ?  {ecTable}  generalizedTable : <div></div>} */}
        </div>
      );
    
}


export default EC;
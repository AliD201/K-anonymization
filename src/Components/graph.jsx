import React from 'react';
import * as V from 'victory';
import { VictoryLine, VictoryChart,VictoryVoronoiContainer,VictoryTooltip,VictoryAxis} from 'victory';

const Graph = (props) =>{
    //x
    let k = props.ks
    //y
    let y = props.measure
    let data =[];
    for (let i = 0; i < k.length; i++) {
        data.push({x:k[i],y:y[i],label:k[i]})     
    }
    // data.push({x:3,y:0.6,label:"test"})
    return (
      <div className="ma4 " style={{flexGrow: "1"}}>
          <h4 className="ma0">{props.name}</h4>
        <VictoryChart
        containerComponent={
            <VictoryVoronoiContainer label={d => `${d.label}`} />
          }
          >
               <VictoryAxis
          // tickValues specifies both the number of ticks and where
          // they are placed on the axis
          tickValues={k}
          tickFormat={k}
        />
         <VictoryAxis
          dependentAxis
          // tickFormat specifies how ticks should be displayed
          tickFormat={(y)=>{
            if(y>1000){
              return `${Number((y/1000).toFixed(2))}k`
            }
            return `${Number(y.toFixed(2))}`
          }}
        />
          <VictoryLine
          labelComponent={<VictoryTooltip />}
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
              
            }}
            data={data}
            name = "series-1"
          ></VictoryLine>
        </VictoryChart>
      </div>
    );
}

export default Graph;

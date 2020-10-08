import React from 'react';

const Scroll = (props) =>{
  var direction;
  var wrap =""
  if ( props.flexDirection !== undefined){
    direction = props.flexDirection
  }else {
    direction = "row"
    wrap = "wrap"
  }
  let myStyle = {overflowY:'scroll', border:'1px solid black', height:'45rem', padding:'1rem', paddingTop:'0', width:"100%",  display: "flex",
  flexDirection:direction,
  flexWrap: wrap} 
  return (
    <div style={myStyle} className=" ma0">
    {props.children}
    </div>
  )
}

export default Scroll;

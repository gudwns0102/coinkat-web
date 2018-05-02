import React from 'react'
import RaisedButton from 'material-ui/RaisedButton';

import 'react-table/react-table.css'
import './Board.css'
import ReactTable from 'react-table';

import { getHeaderImg, toLocaleString, translate2Origin } from '../lib';

export default function Board({data, style}){
  if(Object.keys(data).length == 0){
    return <span>Loading</span>;
  }

  var length = Object.keys(data.coinone).length;
  const tableData = Object.keys(data.coinone).map(coinName => {
    var { currentPrice, openPrice } = data.coinone[coinName];
    const margin = Number(currentPrice) - Number(openPrice);
    const percent = Number((margin/Number(openPrice)*100).toFixed(2));
  
    return {
      name: coinName,
      price: Number(currentPrice),
      delta: {
        margin,
        percent,
      }
    }
  })

  const columns = [{
    Header: props => 
      <RaisedButton 
        className='hello'
        style={{width:'100%', height:40}}
        label='Cryptocurrency'
        buttonStyle={{backgroundColor: 'white'}}/>,
    accessor: 'name', // String-based value accessors!
    Cell: props => 
      <div style={{ ...styles.cell_1}} className='number'>
        <img src={getHeaderImg(props.value)} alt={props.value} style={{height:30, marginRight: 10}}/>
        {translate2Origin(props.value)}
      </div>, // Custom cell components!
    sortable: false,
    resizable: false,
  }, {
    Header: 
      <RaisedButton 
        className='hello'
        style={{width:'100%', height:40}}
        label='Price'
        buttonStyle={{backgroundColor: 'white'}}/>,
    accessor: 'price',
    Cell: props => <div className='number' style={{ ...styles.cell_2}}>{toLocaleString(props.value)} 원</div>, // Custom cell components!
    resizable: false,
  }, {
    Header: 
      <RaisedButton 
        className='hello'
        style={{width:'100%', height:40}}
        label='%'
        buttonStyle={{backgroundColor: 'white'}}/>,
    accessor: 'delta.percent', // Custom value accessors!
    Cell: props => {
      const { margin, percent } = props.original.delta;
      const delta = margin > 0 ? `+${toLocaleString(margin)} 원(+${percent}%) ▲ ` : margin === 0 ? '0(0%)' : `${toLocaleString(margin)}(${percent}%) ▼ `;
      const textStyle = margin > 0 ? styles.textColorRed : margin < 0 ? styles.textColorBlue : {}; 
      return (
        <div className='number' style={{...styles.cell_3, ...textStyle, }}>{delta}</div>
      );
    },
    resizable: false,
  }]

  return (
    <ReactTable
      style={style}
      data={tableData}
      columns={columns}
      showPagination={false}
      pageSize={length}
      getTheadTrProps={() => {
        return {
          style: {
            height: 40,
            backgroundColor:'white'
          }
        }
      }}
      getTdProps={({state, rowInfo, column}) => {
        return {
          style: {
            fontFamily:'Nanum Gothic', 
            fontWeight:'800', 
            backgroundColor:'white'
          }
        }
      }}

    />
  )
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height:'100%'
  },

  header: {
    fontFamily:'Nanum Gothic', 
    fontWeight:'400',
  },

  cell_1: {
    display:'flex',
    alignItems:'center',
    color:'#133e5c',
    fontFamily: 'Quicksand',
  },

  cell_2: {
    display:'flex',
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'flex-end',
    color:'#333',
    fontFamily: 'Quicksand',
  },
  
  cell_3: {
    width:'100%',
    height:'100%',
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
    fontFamily: 'Quicksand',
  },

  textColorRed: {
    color: '#E53935'
  },

  textColorBlue: {
    color: '#3F51B5'
  }
}
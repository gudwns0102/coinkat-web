import styled from 'styled-components';

const RED = '#C62828'
const BLUE = '#283593'

const Price = styled.div`
  color: ${props => props.red ? RED : props.blue ? BLUE : 'black'};
  font-size: ${props => props.fontSize || '1.4vw'};
`

//Console Push ADD
const ControllBox = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.shrink === true ? '100%' : '35vw'};
  height: ${props => props.shrink === true ? '200px' : '100%'};
  padding-left: 2%;
  padding-right: 2%;
`;

const CoinSelectBox = styled.div`
  display: flex; 
  justify-content: center;
  align-items: 'center';
  flex: 1;
  overflow-x: hidden;
  background-image: url(${require('../../assets/images/art.png')}), linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0)); 
  background-size: cover; 
  background-position: center;
  background-blend-mode: lighten;
`

const CBHeader = styled.div`
    height: 20vh; 
    width: 100%;
    display: flex;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const CBBody = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const CBForm = styled.div`
`;

const FormWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const FormDescriptor = styled.span`
  font-size: calc(8px + 1.2vw);
  margin-right: 3%;
  color: ${props => props.red ? RED : props.blue ? BLUE : 'black'};
  width: 20%;
`;

const Form = styled.input`
  border: 0;
  out-line: 0;
  color: ${props => props.red ? RED : props.blue ? BLUE : 'black'};
  width: ${props => props.price ? '50%' : '40%'};
  text-align: center;
  border-bottom: 1px dashed black;
  font-size: calc(8px + 1.0vw);
  background-color: transparent;
`;

const Translation = styled.span`
  font-size: calc(8px + 0.8vw);
  color: #AAAAAA;
  margin-left: 20px;
`;

export {
  Price,
  ControllBox,
  CoinSelectBox,
  CBHeader,
  CBBody,
  CBForm,
  FormWrapper,
  FormDescriptor,
  Form,
  Translation,
}
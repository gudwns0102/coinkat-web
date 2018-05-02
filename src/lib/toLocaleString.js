export default function toLocaleString(input){
    let result = typeof input === 'number' ? input.toString() : input;
    return result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};


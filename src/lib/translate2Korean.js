export default function translate2Korean(input, option){
    switch(input){
        case 'BTC':
            return '비트코인';
        
        case 'ETH':
            return '이더리움';

        case 'DASH':
            return '대쉬';

        case 'XRP':
            return '리플';

        case 'LTC':
            return '라이트코인';
        
        case 'ETC':
            return '이더리움 클래식';
        
        case 'BCH':
            return '비트코인 캐시';
        
        case 'XMR':
            return '모네로';

        case 'ZEC':
            return '제트코인';
        
        case 'QTUM':
            return '퀀텀';

        case 'BTG':
            return '비트코인 골드';

        case 'EOS':
            return '이오스';

        case 'IOTA':
            return '아이오타';

        default:
            return input;
    }
}


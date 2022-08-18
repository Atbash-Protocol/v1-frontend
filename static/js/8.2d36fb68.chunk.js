(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[8],{460:function(n){n.exports=JSON.parse('{"address":"0x59b670e9fA9D0A427751Af201D676719a970857b","abi":[{"inputs":[{"internalType":"address","name":"_Bash","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"Bash","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"}],"name":"getKValue","outputs":[{"internalType":"uint256","name":"k_","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"}],"name":"getTotalValue","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"}],"name":"markdown","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pair","type":"address"},{"internalType":"uint256","name":"amount_","type":"uint256"}],"name":"valuation","outputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"stateMutability":"view","type":"function"}],"transactionHash":"0x8ba1652414983aa81c7e753555a777078e8d474b51e61f995f9e10ed00d13c3a","receipt":{"to":null,"from":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266","contractAddress":"0x59b670e9fA9D0A427751Af201D676719a970857b","transactionIndex":0,"gasUsed":"846592","logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000","blockHash":"0x14d97c62648c15ba69a22fadb2a3d2e4f513d7bb6a2fcf9f48225f4b04d5ea93","transactionHash":"0x8ba1652414983aa81c7e753555a777078e8d474b51e61f995f9e10ed00d13c3a","logs":[],"blockNumber":22,"cumulativeGasUsed":"846592","status":1,"byzantium":true},"args":["0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],"numDeployments":1,"solcInputHash":"3a5845fa4732b1afffad134d92d19d2c","metadata":"{\\"compiler\\":{\\"version\\":\\"0.7.5+commit.eb77ed08\\"},\\"language\\":\\"Solidity\\",\\"output\\":{\\"abi\\":[{\\"inputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"_Bash\\",\\"type\\":\\"address\\"}],\\"stateMutability\\":\\"nonpayable\\",\\"type\\":\\"constructor\\"},{\\"inputs\\":[],\\"name\\":\\"Bash\\",\\"outputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"\\",\\"type\\":\\"address\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"},{\\"inputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"_pair\\",\\"type\\":\\"address\\"}],\\"name\\":\\"getKValue\\",\\"outputs\\":[{\\"internalType\\":\\"uint256\\",\\"name\\":\\"k_\\",\\"type\\":\\"uint256\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"},{\\"inputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"_pair\\",\\"type\\":\\"address\\"}],\\"name\\":\\"getTotalValue\\",\\"outputs\\":[{\\"internalType\\":\\"uint256\\",\\"name\\":\\"_value\\",\\"type\\":\\"uint256\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"},{\\"inputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"_pair\\",\\"type\\":\\"address\\"}],\\"name\\":\\"markdown\\",\\"outputs\\":[{\\"internalType\\":\\"uint256\\",\\"name\\":\\"\\",\\"type\\":\\"uint256\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"},{\\"inputs\\":[{\\"internalType\\":\\"address\\",\\"name\\":\\"_pair\\",\\"type\\":\\"address\\"},{\\"internalType\\":\\"uint256\\",\\"name\\":\\"amount_\\",\\"type\\":\\"uint256\\"}],\\"name\\":\\"valuation\\",\\"outputs\\":[{\\"internalType\\":\\"uint256\\",\\"name\\":\\"_value\\",\\"type\\":\\"uint256\\"}],\\"stateMutability\\":\\"view\\",\\"type\\":\\"function\\"}],\\"devdoc\\":{\\"kind\\":\\"dev\\",\\"methods\\":{},\\"version\\":1},\\"userdoc\\":{\\"kind\\":\\"user\\",\\"methods\\":{},\\"version\\":1}},\\"settings\\":{\\"compilationTarget\\":{\\"contracts/BondingCalculator.sol\\":\\"ATBASHBondingCalculator\\"},\\"evmVersion\\":\\"istanbul\\",\\"libraries\\":{},\\"metadata\\":{\\"bytecodeHash\\":\\"ipfs\\",\\"useLiteralContent\\":true},\\"optimizer\\":{\\"enabled\\":true,\\"runs\\":200},\\"remappings\\":[]},\\"sources\\":{\\"@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol\\":{\\"content\\":\\"pragma solidity >=0.5.0;\\\\n\\\\ninterface IUniswapV2Pair {\\\\n    event Approval(address indexed owner, address indexed spender, uint value);\\\\n    event Transfer(address indexed from, address indexed to, uint value);\\\\n\\\\n    function name() external pure returns (string memory);\\\\n    function symbol() external pure returns (string memory);\\\\n    function decimals() external pure returns (uint8);\\\\n    function totalSupply() external view returns (uint);\\\\n    function balanceOf(address owner) external view returns (uint);\\\\n    function allowance(address owner, address spender) external view returns (uint);\\\\n\\\\n    function approve(address spender, uint value) external returns (bool);\\\\n    function transfer(address to, uint value) external returns (bool);\\\\n    function transferFrom(address from, address to, uint value) external returns (bool);\\\\n\\\\n    function DOMAIN_SEPARATOR() external view returns (bytes32);\\\\n    function PERMIT_TYPEHASH() external pure returns (bytes32);\\\\n    function nonces(address owner) external view returns (uint);\\\\n\\\\n    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;\\\\n\\\\n    event Mint(address indexed sender, uint amount0, uint amount1);\\\\n    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);\\\\n    event Swap(\\\\n        address indexed sender,\\\\n        uint amount0In,\\\\n        uint amount1In,\\\\n        uint amount0Out,\\\\n        uint amount1Out,\\\\n        address indexed to\\\\n    );\\\\n    event Sync(uint112 reserve0, uint112 reserve1);\\\\n\\\\n    function MINIMUM_LIQUIDITY() external pure returns (uint);\\\\n    function factory() external view returns (address);\\\\n    function token0() external view returns (address);\\\\n    function token1() external view returns (address);\\\\n    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);\\\\n    function price0CumulativeLast() external view returns (uint);\\\\n    function price1CumulativeLast() external view returns (uint);\\\\n    function kLast() external view returns (uint);\\\\n\\\\n    function mint(address to) external returns (uint liquidity);\\\\n    function burn(address to) external returns (uint amount0, uint amount1);\\\\n    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;\\\\n    function skim(address to) external;\\\\n    function sync() external;\\\\n\\\\n    function initialize(address, address) external;\\\\n}\\\\n\\",\\"keccak256\\":\\"0x7c9bc70e5996c763e02ff38905282bc24fb242b0ef2519a003b36824fc524a4b\\"},\\"contracts/BondingCalculator.sol\\":{\\"content\\":\\"// SPDX-License-Identifier: AGPL-3.0-or-later\\\\r\\\\npragma solidity 0.7.5;\\\\r\\\\n\\\\r\\\\nimport {IERC20} from \\\\\\"./interfaces/IERC20.sol\\\\\\";\\\\r\\\\nimport \\\\\\"@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol\\\\\\";\\\\r\\\\n\\\\r\\\\nlibrary FullMath {\\\\r\\\\n    function fullMul(uint256 x, uint256 y)\\\\r\\\\n        private\\\\r\\\\n        pure\\\\r\\\\n        returns (uint256 l, uint256 h)\\\\r\\\\n    {\\\\r\\\\n        uint256 mm = mulmod(x, y, uint256(-1));\\\\r\\\\n        l = x * y;\\\\r\\\\n        h = mm - l;\\\\r\\\\n        if (mm < l) h -= 1;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function fullDiv(\\\\r\\\\n        uint256 l,\\\\r\\\\n        uint256 h,\\\\r\\\\n        uint256 d\\\\r\\\\n    ) private pure returns (uint256) {\\\\r\\\\n        uint256 pow2 = d & -d;\\\\r\\\\n        d /= pow2;\\\\r\\\\n        l /= pow2;\\\\r\\\\n        l += h * ((-pow2) / pow2 + 1);\\\\r\\\\n        uint256 r = 1;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        r *= 2 - d * r;\\\\r\\\\n        return l * r;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function mulDiv(\\\\r\\\\n        uint256 x,\\\\r\\\\n        uint256 y,\\\\r\\\\n        uint256 d\\\\r\\\\n    ) internal pure returns (uint256) {\\\\r\\\\n        (uint256 l, uint256 h) = fullMul(x, y);\\\\r\\\\n        uint256 mm = mulmod(x, y, d);\\\\r\\\\n        if (mm > l) h -= 1;\\\\r\\\\n        l -= mm;\\\\r\\\\n        require(h < d, \\\\\\"FullMath::mulDiv: overflow\\\\\\");\\\\r\\\\n        return fullDiv(l, h, d);\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\nlibrary Babylonian {\\\\r\\\\n    function sqrt(uint256 x) internal pure returns (uint256) {\\\\r\\\\n        if (x == 0) return 0;\\\\r\\\\n\\\\r\\\\n        uint256 xx = x;\\\\r\\\\n        uint256 r = 1;\\\\r\\\\n        if (xx >= 0x100000000000000000000000000000000) {\\\\r\\\\n            xx >>= 128;\\\\r\\\\n            r <<= 64;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x10000000000000000) {\\\\r\\\\n            xx >>= 64;\\\\r\\\\n            r <<= 32;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x100000000) {\\\\r\\\\n            xx >>= 32;\\\\r\\\\n            r <<= 16;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x10000) {\\\\r\\\\n            xx >>= 16;\\\\r\\\\n            r <<= 8;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x100) {\\\\r\\\\n            xx >>= 8;\\\\r\\\\n            r <<= 4;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x10) {\\\\r\\\\n            xx >>= 4;\\\\r\\\\n            r <<= 2;\\\\r\\\\n        }\\\\r\\\\n        if (xx >= 0x8) {\\\\r\\\\n            r <<= 1;\\\\r\\\\n        }\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1;\\\\r\\\\n        r = (r + x / r) >> 1; // Seven iterations should be enough\\\\r\\\\n        uint256 r1 = x / r;\\\\r\\\\n        return (r < r1 ? r : r1);\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\nlibrary BitMath {\\\\r\\\\n    function mostSignificantBit(uint256 x) internal pure returns (uint8 r) {\\\\r\\\\n        require(x > 0, \\\\\\"BitMath::mostSignificantBit: zero\\\\\\");\\\\r\\\\n\\\\r\\\\n        if (x >= 0x100000000000000000000000000000000) {\\\\r\\\\n            x >>= 128;\\\\r\\\\n            r += 128;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x10000000000000000) {\\\\r\\\\n            x >>= 64;\\\\r\\\\n            r += 64;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x100000000) {\\\\r\\\\n            x >>= 32;\\\\r\\\\n            r += 32;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x10000) {\\\\r\\\\n            x >>= 16;\\\\r\\\\n            r += 16;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x100) {\\\\r\\\\n            x >>= 8;\\\\r\\\\n            r += 8;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x10) {\\\\r\\\\n            x >>= 4;\\\\r\\\\n            r += 4;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x4) {\\\\r\\\\n            x >>= 2;\\\\r\\\\n            r += 2;\\\\r\\\\n        }\\\\r\\\\n        if (x >= 0x2) r += 1;\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\nlibrary FixedPoint {\\\\r\\\\n    // range: [0, 2**112 - 1]\\\\r\\\\n    // resolution: 1 / 2**112\\\\r\\\\n    struct uq112x112 {\\\\r\\\\n        uint224 _x;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    // range: [0, 2**144 - 1]\\\\r\\\\n    // resolution: 1 / 2**112\\\\r\\\\n    struct uq144x112 {\\\\r\\\\n        uint256 _x;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    uint8 private constant RESOLUTION = 112;\\\\r\\\\n    uint256 private constant Q112 = 0x10000000000000000000000000000;\\\\r\\\\n    uint256 private constant Q224 =\\\\r\\\\n        0x100000000000000000000000000000000000000000000000000000000;\\\\r\\\\n    uint256 private constant LOWER_MASK = 0xffffffffffffffffffffffffffff; // decimal of UQ*x112 (lower 112 bits)\\\\r\\\\n\\\\r\\\\n    // decode a UQ112x112 into a uint112 by truncating after the radix point\\\\r\\\\n    function decode(uq112x112 memory self) internal pure returns (uint112) {\\\\r\\\\n        return uint112(self._x >> RESOLUTION);\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    // decode a uq112x112 into a uint with 18 decimals of precision\\\\r\\\\n    function decode112with18(uq112x112 memory self)\\\\r\\\\n        internal\\\\r\\\\n        pure\\\\r\\\\n        returns (uint256)\\\\r\\\\n    {\\\\r\\\\n        return uint256(self._x) / 5192296858534827;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function fraction(uint256 numerator, uint256 denominator)\\\\r\\\\n        internal\\\\r\\\\n        pure\\\\r\\\\n        returns (uq112x112 memory)\\\\r\\\\n    {\\\\r\\\\n        require(denominator > 0, \\\\\\"FixedPoint::fraction: division by zero\\\\\\");\\\\r\\\\n        if (numerator == 0) return FixedPoint.uq112x112(0);\\\\r\\\\n\\\\r\\\\n        if (numerator <= uint144(-1)) {\\\\r\\\\n            uint256 result = (numerator << RESOLUTION) / denominator;\\\\r\\\\n            require(result <= uint224(-1), \\\\\\"FixedPoint::fraction: overflow\\\\\\");\\\\r\\\\n            return uq112x112(uint224(result));\\\\r\\\\n        } else {\\\\r\\\\n            uint256 result = FullMath.mulDiv(numerator, Q112, denominator);\\\\r\\\\n            require(result <= uint224(-1), \\\\\\"FixedPoint::fraction: overflow\\\\\\");\\\\r\\\\n            return uq112x112(uint224(result));\\\\r\\\\n        }\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    // square root of a UQ112x112\\\\r\\\\n    // lossy between 0/1 and 40 bits\\\\r\\\\n    function sqrt(uq112x112 memory self)\\\\r\\\\n        internal\\\\r\\\\n        pure\\\\r\\\\n        returns (uq112x112 memory)\\\\r\\\\n    {\\\\r\\\\n        if (self._x <= uint144(-1)) {\\\\r\\\\n            return uq112x112(uint224(Babylonian.sqrt(uint256(self._x) << 112)));\\\\r\\\\n        }\\\\r\\\\n\\\\r\\\\n        uint8 safeShiftBits = 255 - BitMath.mostSignificantBit(self._x);\\\\r\\\\n        safeShiftBits -= safeShiftBits % 2;\\\\r\\\\n        return\\\\r\\\\n            uq112x112(\\\\r\\\\n                uint224(\\\\r\\\\n                    Babylonian.sqrt(uint256(self._x) << safeShiftBits) <<\\\\r\\\\n                        ((112 - safeShiftBits) / 2)\\\\r\\\\n                )\\\\r\\\\n            );\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\nlibrary SafeMath {\\\\r\\\\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\\\\r\\\\n        uint256 c = a + b;\\\\r\\\\n        require(c >= a, \\\\\\"SafeMath: addition overflow\\\\\\");\\\\r\\\\n\\\\r\\\\n        return c;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\\\\r\\\\n        return sub(a, b, \\\\\\"SafeMath: subtraction overflow\\\\\\");\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function sub(\\\\r\\\\n        uint256 a,\\\\r\\\\n        uint256 b,\\\\r\\\\n        string memory errorMessage\\\\r\\\\n    ) internal pure returns (uint256) {\\\\r\\\\n        require(b <= a, errorMessage);\\\\r\\\\n        uint256 c = a - b;\\\\r\\\\n\\\\r\\\\n        return c;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\\\\r\\\\n        if (a == 0) {\\\\r\\\\n            return 0;\\\\r\\\\n        }\\\\r\\\\n\\\\r\\\\n        uint256 c = a * b;\\\\r\\\\n        require(c / a == b, \\\\\\"SafeMath: multiplication overflow\\\\\\");\\\\r\\\\n\\\\r\\\\n        return c;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\\\\r\\\\n        return div(a, b, \\\\\\"SafeMath: division by zero\\\\\\");\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function div(\\\\r\\\\n        uint256 a,\\\\r\\\\n        uint256 b,\\\\r\\\\n        string memory errorMessage\\\\r\\\\n    ) internal pure returns (uint256) {\\\\r\\\\n        require(b > 0, errorMessage);\\\\r\\\\n        uint256 c = a / b;\\\\r\\\\n        // assert(a == b * c + a % b); // There is no case in which this doesn\'t hold\\\\r\\\\n\\\\r\\\\n        return c;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function sqrrt(uint256 a) internal pure returns (uint256 c) {\\\\r\\\\n        if (a > 3) {\\\\r\\\\n            c = a;\\\\r\\\\n            uint256 b = add(div(a, 2), 1);\\\\r\\\\n            while (b < c) {\\\\r\\\\n                c = b;\\\\r\\\\n                b = div(add(div(a, b), b), 2);\\\\r\\\\n            }\\\\r\\\\n        } else if (a != 0) {\\\\r\\\\n            c = 1;\\\\r\\\\n        }\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\ninterface IUniswapV2ERC20 {\\\\r\\\\n    function totalSupply() external view returns (uint256);\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\ninterface IBondingCalculator {\\\\r\\\\n    function valuation(address pair_, uint256 amount_)\\\\r\\\\n        external\\\\r\\\\n        view\\\\r\\\\n        returns (uint256 _value);\\\\r\\\\n}\\\\r\\\\n\\\\r\\\\ncontract ATBASHBondingCalculator is IBondingCalculator {\\\\r\\\\n    using FixedPoint for *;\\\\r\\\\n    using SafeMath for uint256;\\\\r\\\\n    using SafeMath for uint112;\\\\r\\\\n\\\\r\\\\n    address public immutable Bash;\\\\r\\\\n\\\\r\\\\n    constructor(address _Bash) {\\\\r\\\\n        require(_Bash != address(0));\\\\r\\\\n        Bash = _Bash;\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function getKValue(address _pair) public view returns (uint256 k_) {\\\\r\\\\n        uint256 token0 = IERC20(IUniswapV2Pair(_pair).token0()).decimals();\\\\r\\\\n        uint256 token1 = IERC20(IUniswapV2Pair(_pair).token1()).decimals();\\\\r\\\\n        uint256 decimals = token0.add(token1).sub(IERC20(_pair).decimals());\\\\r\\\\n\\\\r\\\\n        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(_pair)\\\\r\\\\n            .getReserves();\\\\r\\\\n        k_ = reserve0.mul(reserve1).div(10**decimals);\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function getTotalValue(address _pair) public view returns (uint256 _value) {\\\\r\\\\n        _value = getKValue(_pair).sqrrt().mul(2);\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function valuation(address _pair, uint256 amount_)\\\\r\\\\n        external\\\\r\\\\n        view\\\\r\\\\n        override\\\\r\\\\n        returns (uint256 _value)\\\\r\\\\n    {\\\\r\\\\n        uint256 totalValue = getTotalValue(_pair);\\\\r\\\\n        uint256 totalSupply = IUniswapV2Pair(_pair).totalSupply();\\\\r\\\\n\\\\r\\\\n        _value = totalValue\\\\r\\\\n            .mul(FixedPoint.fraction(amount_, totalSupply).decode112with18())\\\\r\\\\n            .div(1e18);\\\\r\\\\n    }\\\\r\\\\n\\\\r\\\\n    function markdown(address _pair) external view returns (uint256) {\\\\r\\\\n        (uint256 reserve0, uint256 reserve1, ) = IUniswapV2Pair(_pair)\\\\r\\\\n            .getReserves();\\\\r\\\\n        require(\\\\r\\\\n            IUniswapV2Pair(_pair).token0() == Bash ||\\\\r\\\\n                IUniswapV2Pair(_pair).token1() == Bash,\\\\r\\\\n            \\\\\\"Pair missing Bash\\\\\\"\\\\r\\\\n        );\\\\r\\\\n\\\\r\\\\n        uint256 reserve;\\\\r\\\\n        if (IUniswapV2Pair(_pair).token0() == Bash) {\\\\r\\\\n            reserve = reserve1;\\\\r\\\\n        } else {\\\\r\\\\n            reserve = reserve0;\\\\r\\\\n        }\\\\r\\\\n        return\\\\r\\\\n            reserve.mul(2 * (10**IERC20(Bash).decimals())).div(getTotalValue(_pair));\\\\r\\\\n    }\\\\r\\\\n}\\\\r\\\\n\\",\\"keccak256\\":\\"0x29c2fbb6bb8a748c7d039b1729cf207e21fbc839a405d9b6c80334c9bcde95bc\\",\\"license\\":\\"AGPL-3.0-or-later\\"},\\"contracts/interfaces/IERC20.sol\\":{\\"content\\":\\"// SPDX-License-Identifier: AGPL-3.0-or-later\\\\r\\\\npragma solidity 0.7.5;\\\\r\\\\n\\\\r\\\\ninterface IERC20 {\\\\r\\\\n    /**\\\\r\\\\n     * @dev Returns the decimals of the token.\\\\r\\\\n     */\\\\r\\\\n    function decimals() external view returns (uint8);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Returns the amount of tokens in existence.\\\\r\\\\n     */\\\\r\\\\n    function totalSupply() external view returns (uint256);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Returns the amount of tokens owned by `account`.\\\\r\\\\n     */\\\\r\\\\n    function balanceOf(address account) external view returns (uint256);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Moves `amount` tokens from the caller\'s account to `recipient`.\\\\r\\\\n     *\\\\r\\\\n     * Returns a boolean value indicating whether the operation succeeded.\\\\r\\\\n     *\\\\r\\\\n     * Emits a {Transfer} event.\\\\r\\\\n     */\\\\r\\\\n    function transfer(address recipient, uint256 amount)\\\\r\\\\n        external\\\\r\\\\n        returns (bool);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Returns the remaining number of tokens that `spender` will be\\\\r\\\\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\\\\r\\\\n     * zero by default.\\\\r\\\\n     *\\\\r\\\\n     * This value changes when {approve} or {transferFrom} are called.\\\\r\\\\n     */\\\\r\\\\n    function allowance(address owner, address spender)\\\\r\\\\n        external\\\\r\\\\n        view\\\\r\\\\n        returns (uint256);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Sets `amount` as the allowance of `spender` over the caller\'s tokens.\\\\r\\\\n     *\\\\r\\\\n     * Returns a boolean value indicating whether the operation succeeded.\\\\r\\\\n     *\\\\r\\\\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\\\\r\\\\n     * that someone may use both the old and the new allowance by unfortunate\\\\r\\\\n     * transaction ordering. One possible solution to mitigate this race\\\\r\\\\n     * condition is to first reduce the spender\'s allowance to 0 and set the\\\\r\\\\n     * desired value afterwards:\\\\r\\\\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\\\\r\\\\n     *\\\\r\\\\n     * Emits an {Approval} event.\\\\r\\\\n     */\\\\r\\\\n    function approve(address spender, uint256 amount) external returns (bool);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Moves `amount` tokens from `sender` to `recipient` using the\\\\r\\\\n     * allowance mechanism. `amount` is then deducted from the caller\'s\\\\r\\\\n     * allowance.\\\\r\\\\n     *\\\\r\\\\n     * Returns a boolean value indicating whether the operation succeeded.\\\\r\\\\n     *\\\\r\\\\n     * Emits a {Transfer} event.\\\\r\\\\n     */\\\\r\\\\n    function transferFrom(\\\\r\\\\n        address sender,\\\\r\\\\n        address recipient,\\\\r\\\\n        uint256 amount\\\\r\\\\n    ) external returns (bool);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\\\\r\\\\n     * another (`to`).\\\\r\\\\n     *\\\\r\\\\n     * Note that `value` may be zero.\\\\r\\\\n     */\\\\r\\\\n    event Transfer(address indexed from, address indexed to, uint256 value);\\\\r\\\\n\\\\r\\\\n    /**\\\\r\\\\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\\\\r\\\\n     * a call to {approve}. `value` is the new allowance.\\\\r\\\\n     */\\\\r\\\\n    event Approval(\\\\r\\\\n        address indexed owner,\\\\r\\\\n        address indexed spender,\\\\r\\\\n        uint256 value\\\\r\\\\n    );\\\\r\\\\n}\\\\r\\\\n\\",\\"keccak256\\":\\"0xd2dbf3d69a22df3aaa56a1a70285cfe9d4c180c4724a4c7b63a851c779733092\\",\\"license\\":\\"AGPL-3.0-or-later\\"}},\\"version\\":1}","bytecode":"0x60a060405234801561001057600080fd5b50604051610ee8380380610ee88339818101604052602081101561003357600080fd5b50516001600160a01b03811661004857600080fd5b606081901b6001600160601b0319166080526001600160a01b0316610e5a61008e600039806101ce5280610254528061033552806103ec52806104925250610e5a6000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806332da80a31461005c5780633c4e6da7146100945780634249719f146100b8578063490084ef146100e4578063686375491461010a575b600080fd5b6100826004803603602081101561007257600080fd5b50356001600160a01b0316610130565b60408051918252519081900360200190f35b61009c610490565b604080516001600160a01b039092168252519081900360200190f35b610082600480360360408110156100ce57600080fd5b506001600160a01b0381351690602001356104b4565b610082600480360360208110156100fa57600080fd5b50356001600160a01b031661055c565b6100826004803603602081101561012057600080fd5b50356001600160a01b0316610842565b6000806000836001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b15801561016e57600080fd5b505afa158015610182573d6000803e3d6000fd5b505050506040513d606081101561019857600080fd5b50805160209182015160408051630dfe168160e01b815290516001600160701b0393841696509290911693506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169390881692630dfe1681926004808201939291829003018186803b15801561021657600080fd5b505afa15801561022a573d6000803e3d6000fd5b505050506040513d602081101561024057600080fd5b50516001600160a01b031614806102ec57507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316846001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b1580156102b557600080fd5b505afa1580156102c9573d6000803e3d6000fd5b505050506040513d60208110156102df57600080fd5b50516001600160a01b0316145b610331576040805162461bcd60e51b81526020600482015260116024820152700a0c2d2e440dad2e6e6d2dcce4084c2e6d607b1b604482015290519081900360640190fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316856001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561039657600080fd5b505afa1580156103aa573d6000803e3d6000fd5b505050506040513d60208110156103c057600080fd5b50516001600160a01b031614156103d85750806103db565b50815b6104856103e786610842565b61047f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561044357600080fd5b505afa158015610457573d6000803e3d6000fd5b505050506040513d602081101561046d57600080fd5b5051849060ff16600a0a600202610866565b906108c6565b93505050505b919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000806104c084610842565b90506000846001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156104fd57600080fd5b505afa158015610511573d6000803e3d6000fd5b505050506040513d602081101561052757600080fd5b50519050610553670de0b6b3a764000061047f61054c6105478886610908565b610a7f565b8590610866565b95945050505050565b600080826001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561059857600080fd5b505afa1580156105ac573d6000803e3d6000fd5b505050506040513d60208110156105c257600080fd5b50516040805163313ce56760e01b815290516001600160a01b039092169163313ce56791600480820192602092909190829003018186803b15801561060657600080fd5b505afa15801561061a573d6000803e3d6000fd5b505050506040513d602081101561063057600080fd5b50516040805163d21220a760e01b8152905160ff90921692506000916001600160a01b0386169163d21220a7916004808301926020929190829003018186803b15801561067c57600080fd5b505afa158015610690573d6000803e3d6000fd5b505050506040513d60208110156106a657600080fd5b50516040805163313ce56760e01b815290516001600160a01b039092169163313ce56791600480820192602092909190829003018186803b1580156106ea57600080fd5b505afa1580156106fe573d6000803e3d6000fd5b505050506040513d602081101561071457600080fd5b50516040805163313ce56760e01b8152905160ff90921692506000916107a4916001600160a01b0388169163313ce56791600480820192602092909190829003018186803b15801561076557600080fd5b505afa158015610779573d6000803e3d6000fd5b505050506040513d602081101561078f57600080fd5b505160ff1661079e8585610a97565b90610af1565b9050600080866001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b1580156107e257600080fd5b505afa1580156107f6573d6000803e3d6000fd5b505050506040513d606081101561080c57600080fd5b5080516020909101516001600160701b039182169350169050610837600a84900a61047f8484610866565b979650505050505050565b6000610860600261085a6108558561055c565b610b33565b90610866565b92915050565b60008261087557506000610860565b8282028284828161088257fe5b04146108bf5760405162461bcd60e51b8152600401808060200182810382526021815260200180610e046021913960400191505060405180910390fd5b9392505050565b60006108bf83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610b9d565b610910610dcb565b6000821161094f5760405162461bcd60e51b8152600401808060200182810382526026815260200180610dde6026913960400191505060405180910390fd5b826109695750604080516020810190915260008152610860565b71ffffffffffffffffffffffffffffffffffff8311610a1057600082607085901b8161099157fe5b0490506001600160e01b038111156109f0576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b6040518060200160405280826001600160e01b0316815250915050610860565b6000610a2184600160701b85610c3f565b90506001600160e01b038111156109f0576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b516612725dd1d243ab6001600160e01b039091160490565b6000828201838110156108bf576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b60006108bf83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610cd4565b60006003821115610b8f5750806000610b57610b508360026108c6565b6001610a97565b90505b81811015610b8957809150610b82610b7b610b7585846108c6565b83610a97565b60026108c6565b9050610b5a565b5061048b565b811561048b57506001919050565b60008183610c295760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610bee578181015183820152602001610bd6565b50505050905090810190601f168015610c1b5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581610c3557fe5b0495945050505050565b6000806000610c4e8686610d2e565b9150915060008480610c5c57fe5b868809905082811115610c70576001820391505b8083039250848210610cc9576040805162461bcd60e51b815260206004820152601a60248201527f46756c6c4d6174683a3a6d756c4469763a206f766572666c6f77000000000000604482015290519081900360640190fd5b610837838387610d5b565b60008184841115610d265760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610bee578181015183820152602001610bd6565b505050900390565b6000808060001984860990508385029250828103915082811015610d53576001820391505b509250929050565b60008181038216808381610d6b57fe5b049250808581610d7757fe5b049450808160000381610d8657fe5b60028581038087028203028087028203028087028203028087028203028087028203028087028203029586029003909402930460010193909302939093010292915050565b6040805160208101909152600081529056fe4669786564506f696e743a3a6672616374696f6e3a206469766973696f6e206279207a65726f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a264697066735822122009bc32e6c57d2daae8ed89f05c7ec354d3f47198b75c8a4c5ad710c3203e4efa64736f6c63430007050033","deployedBytecode":"0x608060405234801561001057600080fd5b50600436106100575760003560e01c806332da80a31461005c5780633c4e6da7146100945780634249719f146100b8578063490084ef146100e4578063686375491461010a575b600080fd5b6100826004803603602081101561007257600080fd5b50356001600160a01b0316610130565b60408051918252519081900360200190f35b61009c610490565b604080516001600160a01b039092168252519081900360200190f35b610082600480360360408110156100ce57600080fd5b506001600160a01b0381351690602001356104b4565b610082600480360360208110156100fa57600080fd5b50356001600160a01b031661055c565b6100826004803603602081101561012057600080fd5b50356001600160a01b0316610842565b6000806000836001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b15801561016e57600080fd5b505afa158015610182573d6000803e3d6000fd5b505050506040513d606081101561019857600080fd5b50805160209182015160408051630dfe168160e01b815290516001600160701b0393841696509290911693506001600160a01b037f000000000000000000000000000000000000000000000000000000000000000081169390881692630dfe1681926004808201939291829003018186803b15801561021657600080fd5b505afa15801561022a573d6000803e3d6000fd5b505050506040513d602081101561024057600080fd5b50516001600160a01b031614806102ec57507f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316846001600160a01b031663d21220a76040518163ffffffff1660e01b815260040160206040518083038186803b1580156102b557600080fd5b505afa1580156102c9573d6000803e3d6000fd5b505050506040513d60208110156102df57600080fd5b50516001600160a01b0316145b610331576040805162461bcd60e51b81526020600482015260116024820152700a0c2d2e440dad2e6e6d2dcce4084c2e6d607b1b604482015290519081900360640190fd5b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316856001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561039657600080fd5b505afa1580156103aa573d6000803e3d6000fd5b505050506040513d60208110156103c057600080fd5b50516001600160a01b031614156103d85750806103db565b50815b6104856103e786610842565b61047f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663313ce5676040518163ffffffff1660e01b815260040160206040518083038186803b15801561044357600080fd5b505afa158015610457573d6000803e3d6000fd5b505050506040513d602081101561046d57600080fd5b5051849060ff16600a0a600202610866565b906108c6565b93505050505b919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b6000806104c084610842565b90506000846001600160a01b03166318160ddd6040518163ffffffff1660e01b815260040160206040518083038186803b1580156104fd57600080fd5b505afa158015610511573d6000803e3d6000fd5b505050506040513d602081101561052757600080fd5b50519050610553670de0b6b3a764000061047f61054c6105478886610908565b610a7f565b8590610866565b95945050505050565b600080826001600160a01b0316630dfe16816040518163ffffffff1660e01b815260040160206040518083038186803b15801561059857600080fd5b505afa1580156105ac573d6000803e3d6000fd5b505050506040513d60208110156105c257600080fd5b50516040805163313ce56760e01b815290516001600160a01b039092169163313ce56791600480820192602092909190829003018186803b15801561060657600080fd5b505afa15801561061a573d6000803e3d6000fd5b505050506040513d602081101561063057600080fd5b50516040805163d21220a760e01b8152905160ff90921692506000916001600160a01b0386169163d21220a7916004808301926020929190829003018186803b15801561067c57600080fd5b505afa158015610690573d6000803e3d6000fd5b505050506040513d60208110156106a657600080fd5b50516040805163313ce56760e01b815290516001600160a01b039092169163313ce56791600480820192602092909190829003018186803b1580156106ea57600080fd5b505afa1580156106fe573d6000803e3d6000fd5b505050506040513d602081101561071457600080fd5b50516040805163313ce56760e01b8152905160ff90921692506000916107a4916001600160a01b0388169163313ce56791600480820192602092909190829003018186803b15801561076557600080fd5b505afa158015610779573d6000803e3d6000fd5b505050506040513d602081101561078f57600080fd5b505160ff1661079e8585610a97565b90610af1565b9050600080866001600160a01b0316630902f1ac6040518163ffffffff1660e01b815260040160606040518083038186803b1580156107e257600080fd5b505afa1580156107f6573d6000803e3d6000fd5b505050506040513d606081101561080c57600080fd5b5080516020909101516001600160701b039182169350169050610837600a84900a61047f8484610866565b979650505050505050565b6000610860600261085a6108558561055c565b610b33565b90610866565b92915050565b60008261087557506000610860565b8282028284828161088257fe5b04146108bf5760405162461bcd60e51b8152600401808060200182810382526021815260200180610e046021913960400191505060405180910390fd5b9392505050565b60006108bf83836040518060400160405280601a81526020017f536166654d6174683a206469766973696f6e206279207a65726f000000000000815250610b9d565b610910610dcb565b6000821161094f5760405162461bcd60e51b8152600401808060200182810382526026815260200180610dde6026913960400191505060405180910390fd5b826109695750604080516020810190915260008152610860565b71ffffffffffffffffffffffffffffffffffff8311610a1057600082607085901b8161099157fe5b0490506001600160e01b038111156109f0576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b6040518060200160405280826001600160e01b0316815250915050610860565b6000610a2184600160701b85610c3f565b90506001600160e01b038111156109f0576040805162461bcd60e51b815260206004820152601e60248201527f4669786564506f696e743a3a6672616374696f6e3a206f766572666c6f770000604482015290519081900360640190fd5b516612725dd1d243ab6001600160e01b039091160490565b6000828201838110156108bf576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b60006108bf83836040518060400160405280601e81526020017f536166654d6174683a207375627472616374696f6e206f766572666c6f770000815250610cd4565b60006003821115610b8f5750806000610b57610b508360026108c6565b6001610a97565b90505b81811015610b8957809150610b82610b7b610b7585846108c6565b83610a97565b60026108c6565b9050610b5a565b5061048b565b811561048b57506001919050565b60008183610c295760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610bee578181015183820152602001610bd6565b50505050905090810190601f168015610c1b5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b506000838581610c3557fe5b0495945050505050565b6000806000610c4e8686610d2e565b9150915060008480610c5c57fe5b868809905082811115610c70576001820391505b8083039250848210610cc9576040805162461bcd60e51b815260206004820152601a60248201527f46756c6c4d6174683a3a6d756c4469763a206f766572666c6f77000000000000604482015290519081900360640190fd5b610837838387610d5b565b60008184841115610d265760405162461bcd60e51b8152602060048201818152835160248401528351909283926044909101919085019080838360008315610bee578181015183820152602001610bd6565b505050900390565b6000808060001984860990508385029250828103915082811015610d53576001820391505b509250929050565b60008181038216808381610d6b57fe5b049250808581610d7757fe5b049450808160000381610d8657fe5b60028581038087028203028087028203028087028203028087028203028087028203028087028203029586029003909402930460010193909302939093010292915050565b6040805160208101909152600081529056fe4669786564506f696e743a3a6672616374696f6e3a206469766973696f6e206279207a65726f536166654d6174683a206d756c7469706c69636174696f6e206f766572666c6f77a264697066735822122009bc32e6c57d2daae8ed89f05c7ec354d3f47198b75c8a4c5ad710c3203e4efa64736f6c63430007050033","devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1},"storageLayout":{"storage":[],"types":null}}')}}]);
//# sourceMappingURL=8.2d36fb68.chunk.js.map
(this["webpackJsonp@scaffold-eth/react-app"]=this["webpackJsonp@scaffold-eth/react-app"]||[]).push([[13],{492:function(n){n.exports=JSON.parse('{"language":"Solidity","sources":{"contracts/mocks/DAI.sol":{"content":"/**\\r\\n *Submitted for verification at Etherscan.io on 2021-09-16\\r\\n*/\\r\\n\\r\\n// File: @openzeppelin/contracts/utils/Context.sol\\r\\n\\r\\n// SPDX-License-Identifier: MIT\\r\\n\\r\\npragma solidity >=0.6.0 <0.8.0;\\r\\n\\r\\n/*\\r\\n * @dev Provides information about the current execution context, including the\\r\\n * sender of the transaction and its data. While these are generally available\\r\\n * via msg.sender and msg.data, they should not be accessed in such a direct\\r\\n * manner, since when dealing with GSN meta-transactions the account sending and\\r\\n * paying for execution may not be the actual sender (as far as an application\\r\\n * is concerned).\\r\\n *\\r\\n * This contract is only required for intermediate, library-like contracts.\\r\\n */\\r\\nabstract contract Context {\\r\\n    function _msgSender() internal view virtual returns (address payable) {\\r\\n        return msg.sender;\\r\\n    }\\r\\n\\r\\n    function _msgData() internal view virtual returns (bytes memory) {\\r\\n        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691\\r\\n        return msg.data;\\r\\n    }\\r\\n}\\r\\n\\r\\n// File: @openzeppelin/contracts/token/ERC20/IERC20.sol\\r\\n\\r\\n\\r\\n\\r\\npragma solidity >=0.6.0 <0.8.0;\\r\\n\\r\\n/**\\r\\n * @dev Interface of the ERC20 standard as defined in the EIP.\\r\\n */\\r\\ninterface IERC20 {\\r\\n    /**\\r\\n     * @dev Returns the amount of tokens in existence.\\r\\n     */\\r\\n    function totalSupply() external view returns (uint256);\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the amount of tokens owned by `account`.\\r\\n     */\\r\\n    function balanceOf(address account) external view returns (uint256);\\r\\n\\r\\n    /**\\r\\n     * @dev Moves `amount` tokens from the caller\'s account to `recipient`.\\r\\n     *\\r\\n     * Returns a boolean value indicating whether the operation succeeded.\\r\\n     *\\r\\n     * Emits a {Transfer} event.\\r\\n     */\\r\\n    function transfer(address recipient, uint256 amount) external returns (bool);\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the remaining number of tokens that `spender` will be\\r\\n     * allowed to spend on behalf of `owner` through {transferFrom}. This is\\r\\n     * zero by default.\\r\\n     *\\r\\n     * This value changes when {approve} or {transferFrom} are called.\\r\\n     */\\r\\n    function allowance(address owner, address spender) external view returns (uint256);\\r\\n\\r\\n    /**\\r\\n     * @dev Sets `amount` as the allowance of `spender` over the caller\'s tokens.\\r\\n     *\\r\\n     * Returns a boolean value indicating whether the operation succeeded.\\r\\n     *\\r\\n     * IMPORTANT: Beware that changing an allowance with this method brings the risk\\r\\n     * that someone may use both the old and the new allowance by unfortunate\\r\\n     * transaction ordering. One possible solution to mitigate this race\\r\\n     * condition is to first reduce the spender\'s allowance to 0 and set the\\r\\n     * desired value afterwards:\\r\\n     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729\\r\\n     *\\r\\n     * Emits an {Approval} event.\\r\\n     */\\r\\n    function approve(address spender, uint256 amount) external returns (bool);\\r\\n\\r\\n    /**\\r\\n     * @dev Moves `amount` tokens from `sender` to `recipient` using the\\r\\n     * allowance mechanism. `amount` is then deducted from the caller\'s\\r\\n     * allowance.\\r\\n     *\\r\\n     * Returns a boolean value indicating whether the operation succeeded.\\r\\n     *\\r\\n     * Emits a {Transfer} event.\\r\\n     */\\r\\n    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);\\r\\n\\r\\n    /**\\r\\n     * @dev Emitted when `value` tokens are moved from one account (`from`) to\\r\\n     * another (`to`).\\r\\n     *\\r\\n     * Note that `value` may be zero.\\r\\n     */\\r\\n    event Transfer(address indexed from, address indexed to, uint256 value);\\r\\n\\r\\n    /**\\r\\n     * @dev Emitted when the allowance of a `spender` for an `owner` is set by\\r\\n     * a call to {approve}. `value` is the new allowance.\\r\\n     */\\r\\n    event Approval(address indexed owner, address indexed spender, uint256 value);\\r\\n}\\r\\n\\r\\n// File: @openzeppelin/contracts/math/SafeMath.sol\\r\\n\\r\\n\\r\\n\\r\\npragma solidity >=0.6.0 <0.8.0;\\r\\n\\r\\n/**\\r\\n * @dev Wrappers over Solidity\'s arithmetic operations with added overflow\\r\\n * checks.\\r\\n *\\r\\n * Arithmetic operations in Solidity wrap on overflow. This can easily result\\r\\n * in bugs, because programmers usually assume that an overflow raises an\\r\\n * error, which is the standard behavior in high level programming languages.\\r\\n * `SafeMath` restores this intuition by reverting the transaction when an\\r\\n * operation overflows.\\r\\n *\\r\\n * Using this library instead of the unchecked operations eliminates an entire\\r\\n * class of bugs, so it\'s recommended to use it always.\\r\\n */\\r\\nlibrary SafeMath {\\r\\n    /**\\r\\n     * @dev Returns the addition of two unsigned integers, with an overflow flag.\\r\\n     *\\r\\n     * _Available since v3.4._\\r\\n     */\\r\\n    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\r\\n        uint256 c = a + b;\\r\\n        if (c < a) return (false, 0);\\r\\n        return (true, c);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the substraction of two unsigned integers, with an overflow flag.\\r\\n     *\\r\\n     * _Available since v3.4._\\r\\n     */\\r\\n    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\r\\n        if (b > a) return (false, 0);\\r\\n        return (true, a - b);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.\\r\\n     *\\r\\n     * _Available since v3.4._\\r\\n     */\\r\\n    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\r\\n        // Gas optimization: this is cheaper than requiring \'a\' not being zero, but the\\r\\n        // benefit is lost if \'b\' is also tested.\\r\\n        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522\\r\\n        if (a == 0) return (true, 0);\\r\\n        uint256 c = a * b;\\r\\n        if (c / a != b) return (false, 0);\\r\\n        return (true, c);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the division of two unsigned integers, with a division by zero flag.\\r\\n     *\\r\\n     * _Available since v3.4._\\r\\n     */\\r\\n    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\r\\n        if (b == 0) return (false, 0);\\r\\n        return (true, a / b);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.\\r\\n     *\\r\\n     * _Available since v3.4._\\r\\n     */\\r\\n    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {\\r\\n        if (b == 0) return (false, 0);\\r\\n        return (true, a % b);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the addition of two unsigned integers, reverting on\\r\\n     * overflow.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `+` operator.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - Addition cannot overflow.\\r\\n     */\\r\\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\\r\\n        uint256 c = a + b;\\r\\n        require(c >= a, \\"SafeMath: addition overflow\\");\\r\\n        return c;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the subtraction of two unsigned integers, reverting on\\r\\n     * overflow (when the result is negative).\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `-` operator.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - Subtraction cannot overflow.\\r\\n     */\\r\\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\\r\\n        require(b <= a, \\"SafeMath: subtraction overflow\\");\\r\\n        return a - b;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the multiplication of two unsigned integers, reverting on\\r\\n     * overflow.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `*` operator.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - Multiplication cannot overflow.\\r\\n     */\\r\\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\\r\\n        if (a == 0) return 0;\\r\\n        uint256 c = a * b;\\r\\n        require(c / a == b, \\"SafeMath: multiplication overflow\\");\\r\\n        return c;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the integer division of two unsigned integers, reverting on\\r\\n     * division by zero. The result is rounded towards zero.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `/` operator. Note: this function uses a\\r\\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\\r\\n     * uses an invalid opcode to revert (consuming all remaining gas).\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - The divisor cannot be zero.\\r\\n     */\\r\\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\\r\\n        require(b > 0, \\"SafeMath: division by zero\\");\\r\\n        return a / b;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\\r\\n     * reverting when dividing by zero.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `%` operator. This function uses a `revert`\\r\\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\\r\\n     * invalid opcode to revert (consuming all remaining gas).\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - The divisor cannot be zero.\\r\\n     */\\r\\n    function mod(uint256 a, uint256 b) internal pure returns (uint256) {\\r\\n        require(b > 0, \\"SafeMath: modulo by zero\\");\\r\\n        return a % b;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on\\r\\n     * overflow (when the result is negative).\\r\\n     *\\r\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\r\\n     * message unnecessarily. For custom revert reasons use {trySub}.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `-` operator.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - Subtraction cannot overflow.\\r\\n     */\\r\\n    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\r\\n        require(b <= a, errorMessage);\\r\\n        return a - b;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the integer division of two unsigned integers, reverting with custom message on\\r\\n     * division by zero. The result is rounded towards zero.\\r\\n     *\\r\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\r\\n     * message unnecessarily. For custom revert reasons use {tryDiv}.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `/` operator. Note: this function uses a\\r\\n     * `revert` opcode (which leaves remaining gas untouched) while Solidity\\r\\n     * uses an invalid opcode to revert (consuming all remaining gas).\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - The divisor cannot be zero.\\r\\n     */\\r\\n    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\r\\n        require(b > 0, errorMessage);\\r\\n        return a / b;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),\\r\\n     * reverting with custom message when dividing by zero.\\r\\n     *\\r\\n     * CAUTION: This function is deprecated because it requires allocating memory for the error\\r\\n     * message unnecessarily. For custom revert reasons use {tryMod}.\\r\\n     *\\r\\n     * Counterpart to Solidity\'s `%` operator. This function uses a `revert`\\r\\n     * opcode (which leaves remaining gas untouched) while Solidity uses an\\r\\n     * invalid opcode to revert (consuming all remaining gas).\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - The divisor cannot be zero.\\r\\n     */\\r\\n    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {\\r\\n        require(b > 0, errorMessage);\\r\\n        return a % b;\\r\\n    }\\r\\n}\\r\\n\\r\\n// File: @openzeppelin/contracts/token/ERC20/ERC20.sol\\r\\n\\r\\n\\r\\n\\r\\npragma solidity >=0.6.0 <0.8.0;\\r\\n\\r\\n\\r\\n\\r\\n\\r\\n/**\\r\\n * @dev Implementation of the {IERC20} interface.\\r\\n *\\r\\n * This implementation is agnostic to the way tokens are created. This means\\r\\n * that a supply mechanism has to be added in a derived contract using {_mint}.\\r\\n * For a generic mechanism see {ERC20PresetMinterPauser}.\\r\\n *\\r\\n * TIP: For a detailed writeup see our guide\\r\\n * https://forum.zeppelin.solutions/t/how-to-implement-erc20-supply-mechanisms/226[How\\r\\n * to implement supply mechanisms].\\r\\n *\\r\\n * We have followed general OpenZeppelin guidelines: functions revert instead\\r\\n * of returning `false` on failure. This behavior is nonetheless conventional\\r\\n * and does not conflict with the expectations of ERC20 applications.\\r\\n *\\r\\n * Additionally, an {Approval} event is emitted on calls to {transferFrom}.\\r\\n * This allows applications to reconstruct the allowance for all accounts just\\r\\n * by listening to said events. Other implementations of the EIP may not emit\\r\\n * these events, as it isn\'t required by the specification.\\r\\n *\\r\\n * Finally, the non-standard {decreaseAllowance} and {increaseAllowance}\\r\\n * functions have been added to mitigate the well-known issues around setting\\r\\n * allowances. See {IERC20-approve}.\\r\\n */\\r\\ncontract ERC20 is Context, IERC20 {\\r\\n    using SafeMath for uint256;\\r\\n\\r\\n    mapping (address => uint256) private _balances;\\r\\n\\r\\n    mapping (address => mapping (address => uint256)) private _allowances;\\r\\n\\r\\n    uint256 private _totalSupply;\\r\\n\\r\\n    string private _name;\\r\\n    string private _symbol;\\r\\n    uint8 private _decimals;\\r\\n\\r\\n    /**\\r\\n     * @dev Sets the values for {name} and {symbol}, initializes {decimals} with\\r\\n     * a default value of 18.\\r\\n     *\\r\\n     * To select a different value for {decimals}, use {_setupDecimals}.\\r\\n     *\\r\\n     * All three of these values are immutable: they can only be set once during\\r\\n     * construction.\\r\\n     */\\r\\n    constructor (string memory name_, string memory symbol_) public {\\r\\n        _name = name_;\\r\\n        _symbol = symbol_;\\r\\n        _decimals = 18;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the name of the token.\\r\\n     */\\r\\n    function name() public view virtual returns (string memory) {\\r\\n        return _name;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the symbol of the token, usually a shorter version of the\\r\\n     * name.\\r\\n     */\\r\\n    function symbol() public view virtual returns (string memory) {\\r\\n        return _symbol;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Returns the number of decimals used to get its user representation.\\r\\n     * For example, if `decimals` equals `2`, a balance of `505` tokens should\\r\\n     * be displayed to a user as `5,05` (`505 / 10 ** 2`).\\r\\n     *\\r\\n     * Tokens usually opt for a value of 18, imitating the relationship between\\r\\n     * Ether and Wei. This is the value {ERC20} uses, unless {_setupDecimals} is\\r\\n     * called.\\r\\n     *\\r\\n     * NOTE: This information is only used for _display_ purposes: it in\\r\\n     * no way affects any of the arithmetic of the contract, including\\r\\n     * {IERC20-balanceOf} and {IERC20-transfer}.\\r\\n     */\\r\\n    function decimals() public view virtual returns (uint8) {\\r\\n        return _decimals;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-totalSupply}.\\r\\n     */\\r\\n    function totalSupply() public view virtual override returns (uint256) {\\r\\n        return _totalSupply;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-balanceOf}.\\r\\n     */\\r\\n    function balanceOf(address account) public view virtual override returns (uint256) {\\r\\n        return _balances[account];\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-transfer}.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `recipient` cannot be the zero address.\\r\\n     * - the caller must have a balance of at least `amount`.\\r\\n     */\\r\\n    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {\\r\\n        _transfer(_msgSender(), recipient, amount);\\r\\n        return true;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-allowance}.\\r\\n     */\\r\\n    function allowance(address owner, address spender) public view virtual override returns (uint256) {\\r\\n        return _allowances[owner][spender];\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-approve}.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `spender` cannot be the zero address.\\r\\n     */\\r\\n    function approve(address spender, uint256 amount) public virtual override returns (bool) {\\r\\n        _approve(_msgSender(), spender, amount);\\r\\n        return true;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev See {IERC20-transferFrom}.\\r\\n     *\\r\\n     * Emits an {Approval} event indicating the updated allowance. This is not\\r\\n     * required by the EIP. See the note at the beginning of {ERC20}.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `sender` and `recipient` cannot be the zero address.\\r\\n     * - `sender` must have a balance of at least `amount`.\\r\\n     * - the caller must have allowance for ``sender``\'s tokens of at least\\r\\n     * `amount`.\\r\\n     */\\r\\n    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {\\r\\n        _transfer(sender, recipient, amount);\\r\\n        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, \\"ERC20: transfer amount exceeds allowance\\"));\\r\\n        return true;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Atomically increases the allowance granted to `spender` by the caller.\\r\\n     *\\r\\n     * This is an alternative to {approve} that can be used as a mitigation for\\r\\n     * problems described in {IERC20-approve}.\\r\\n     *\\r\\n     * Emits an {Approval} event indicating the updated allowance.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `spender` cannot be the zero address.\\r\\n     */\\r\\n    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {\\r\\n        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));\\r\\n        return true;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Atomically decreases the allowance granted to `spender` by the caller.\\r\\n     *\\r\\n     * This is an alternative to {approve} that can be used as a mitigation for\\r\\n     * problems described in {IERC20-approve}.\\r\\n     *\\r\\n     * Emits an {Approval} event indicating the updated allowance.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `spender` cannot be the zero address.\\r\\n     * - `spender` must have allowance for the caller of at least\\r\\n     * `subtractedValue`.\\r\\n     */\\r\\n    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {\\r\\n        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, \\"ERC20: decreased allowance below zero\\"));\\r\\n        return true;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Moves tokens `amount` from `sender` to `recipient`.\\r\\n     *\\r\\n     * This is internal function is equivalent to {transfer}, and can be used to\\r\\n     * e.g. implement automatic token fees, slashing mechanisms, etc.\\r\\n     *\\r\\n     * Emits a {Transfer} event.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `sender` cannot be the zero address.\\r\\n     * - `recipient` cannot be the zero address.\\r\\n     * - `sender` must have a balance of at least `amount`.\\r\\n     */\\r\\n    function _transfer(address sender, address recipient, uint256 amount) internal virtual {\\r\\n        require(sender != address(0), \\"ERC20: transfer from the zero address\\");\\r\\n        require(recipient != address(0), \\"ERC20: transfer to the zero address\\");\\r\\n\\r\\n        _beforeTokenTransfer(sender, recipient, amount);\\r\\n\\r\\n        _balances[sender] = _balances[sender].sub(amount, \\"ERC20: transfer amount exceeds balance\\");\\r\\n        _balances[recipient] = _balances[recipient].add(amount);\\r\\n        emit Transfer(sender, recipient, amount);\\r\\n    }\\r\\n\\r\\n    /** @dev Creates `amount` tokens and assigns them to `account`, increasing\\r\\n     * the total supply.\\r\\n     *\\r\\n     * Emits a {Transfer} event with `from` set to the zero address.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `to` cannot be the zero address.\\r\\n     */\\r\\n    function _mint(address account, uint256 amount) internal virtual {\\r\\n        require(account != address(0), \\"ERC20: mint to the zero address\\");\\r\\n\\r\\n        _beforeTokenTransfer(address(0), account, amount);\\r\\n\\r\\n        _totalSupply = _totalSupply.add(amount);\\r\\n        _balances[account] = _balances[account].add(amount);\\r\\n        emit Transfer(address(0), account, amount);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Destroys `amount` tokens from `account`, reducing the\\r\\n     * total supply.\\r\\n     *\\r\\n     * Emits a {Transfer} event with `to` set to the zero address.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `account` cannot be the zero address.\\r\\n     * - `account` must have at least `amount` tokens.\\r\\n     */\\r\\n    function _burn(address account, uint256 amount) internal virtual {\\r\\n        require(account != address(0), \\"ERC20: burn from the zero address\\");\\r\\n\\r\\n        _beforeTokenTransfer(account, address(0), amount);\\r\\n\\r\\n        _balances[account] = _balances[account].sub(amount, \\"ERC20: burn amount exceeds balance\\");\\r\\n        _totalSupply = _totalSupply.sub(amount);\\r\\n        emit Transfer(account, address(0), amount);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.\\r\\n     *\\r\\n     * This internal function is equivalent to `approve`, and can be used to\\r\\n     * e.g. set automatic allowances for certain subsystems, etc.\\r\\n     *\\r\\n     * Emits an {Approval} event.\\r\\n     *\\r\\n     * Requirements:\\r\\n     *\\r\\n     * - `owner` cannot be the zero address.\\r\\n     * - `spender` cannot be the zero address.\\r\\n     */\\r\\n    function _approve(address owner, address spender, uint256 amount) internal virtual {\\r\\n        require(owner != address(0), \\"ERC20: approve from the zero address\\");\\r\\n        require(spender != address(0), \\"ERC20: approve to the zero address\\");\\r\\n\\r\\n        _allowances[owner][spender] = amount;\\r\\n        emit Approval(owner, spender, amount);\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Sets {decimals} to a value other than the default one of 18.\\r\\n     *\\r\\n     * WARNING: This function should only be called from the constructor. Most\\r\\n     * applications that interact with token contracts will not expect\\r\\n     * {decimals} to ever change, and may work incorrectly if it does.\\r\\n     */\\r\\n    function _setupDecimals(uint8 decimals_) internal virtual {\\r\\n        _decimals = decimals_;\\r\\n    }\\r\\n\\r\\n    /**\\r\\n     * @dev Hook that is called before any transfer of tokens. This includes\\r\\n     * minting and burning.\\r\\n     *\\r\\n     * Calling conditions:\\r\\n     *\\r\\n     * - when `from` and `to` are both non-zero, `amount` of ``from``\'s tokens\\r\\n     * will be to transferred to `to`.\\r\\n     * - when `from` is zero, `amount` tokens will be minted for `to`.\\r\\n     * - when `to` is zero, `amount` of ``from``\'s tokens will be burned.\\r\\n     * - `from` and `to` are never both zero.\\r\\n     *\\r\\n     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].\\r\\n     */\\r\\n    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual { }\\r\\n}\\r\\n\\r\\n// File: contracts/MockERC20.sol\\r\\n\\r\\npragma solidity 0.6.12;\\r\\n\\r\\n\\r\\n// Copied from https://github.com/sushiswap/sushiswap/blob/master/contracts/MockERC20.sol\\r\\n\\r\\ncontract DAI is ERC20 {\\r\\n    constructor(\\r\\n        string memory name,\\r\\n        string memory symbol,\\r\\n        uint256 supply\\r\\n    ) public ERC20(name, symbol) {\\r\\n        \\r\\n    }\\r\\n\\r\\n    function mint(uint _amnt) external {\\r\\n        _mint(msg.sender, _amnt);\\r\\n    }\\r\\n}"}},"settings":{"optimizer":{"enabled":true,"runs":800},"outputSelection":{"*":{"*":["abi","evm.bytecode","evm.deployedBytecode","evm.methodIdentifiers","metadata","devdoc","userdoc","storageLayout","evm.gasEstimates"],"":["ast"]}},"metadata":{"useLiteralContent":true}}}')}}]);
//# sourceMappingURL=13.824f5da1.chunk.js.map
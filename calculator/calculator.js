// Based on http://en.wikipedia.org/wiki/Recursive_descent_parser

function Calculator(expression) {
  this.expressionToParse = expression.replace(/\s+/g, '').split('');
};

Calculator.prototype.run = function () {
  return this.expression();
};

Calculator.prototype.peek = function () {
  return this.expressionToParse[0] || '';
};

Calculator.prototype.get = function () {
  return this.expressionToParse.shift();
};

/*
  Grammar Rule:
  number = [0-9] {[0-9.]+}
  Hint: remember this means we need to get the first number
    followed by any number of numbers (or the period .)
 */

Calculator.prototype.digit = function () {
  return '0123456789'.split('').includes(this.peek());
};

Calculator.prototype.number = function () {
  var isNeg = false;
  if (this.peek() === "-") {
    isNeg = true;
  }

  var result = this.get();
  while (this.digit() || this.peek() == '.') {
    result += this.get();
  }

  return isNeg ? 0 : Number(result);
};

/*
 Grammar Rule:
  factor = number
          | "(" expression ")"
          | - factor
  Hints:
    - If we see a number, produce a number
    - If we see a (  then consume it and an expression
    - If we see a "-", return the negative of the factor
 */
Calculator.prototype.factor = function () {
  if (this.peek() === '-') {
    this.get();
    return -1 * this.factor();
  }

  if (this.digit()) {
    return this.number();
  }

  if (this.peek() === '(') {
    this.get();
    var result = this.expression();
    this.get();
    return result;
  }
};

/*
  term = factor {(*|/) factor}
 */
Calculator.prototype.term = function () {
  var result = this.factor();
  while (this.peek() == '*' || this.peek() == '/') {
    if (this.get() == '*') {
      result *= this.factor();
    } else {
      result /= this.factor();
    }
  }
  return result;
};


/* Grammar Rules
    expression = term {(+|-) term}
*/
Calculator.prototype.expression = function () {
  var result = this.term();
  while (this.peek() == '+' || this.peek() == '-') {
    if (this.get() == '+') {
      result += this.term();
    } else {
      result -= this.term();
    }
  }
  return result;
};

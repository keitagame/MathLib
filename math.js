class AdvancedMath {
  // 基本的な四則演算
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static divide(a, b) {
    if (b === 0) {
      throw new Error("除数は0であってはいけません");
    }
    return a / b;
  }

  static sqrt(a) {
    if (a < 0) {
      throw new Error("負の数に平方根は存在しません");
    }
    return Math.sqrt(a);
  }

  static pow(base, exponent) {
    return Math.pow(base, exponent);
  }

  static sin(a) {
    return Math.sin(a);
  }

  static cos(a) {
    return Math.cos(a);
  }

  static tan(a) {
    return Math.tan(a);
  }

  // 数式の文字列を評価
  static evaluateExpression(expression) {
    const tokens = this.tokenize(expression);
    return this.evaluateRPN(this.infixToPostfix(tokens));
  }

  static tokenize(expression) {
    return expression
      .replace(/\s+/g, '')  // 空白を削除
      .split(/([+\-*/()^])/)
      .filter(Boolean);  // 演算子と数値をトークン化
  }

  static infixToPostfix(tokens) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const output = [];
    const stack = [];

    for (let token of tokens) {
      if (/\d/.test(token)) {
        output.push(Number(token));  // 数字の場合
      } else if (token === '(') {
        stack.push(token);  // 左括弧
      } else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          output.push(stack.pop());  // 右括弧
        }
        stack.pop();  // '(' を取り除く
      } else if (precedence[token]) {
        while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[token]) {
          output.push(stack.pop());
        }
        stack.push(token);
      }
    }

    while (stack.length > 0) {
      output.push(stack.pop());  // 残りの演算子をスタックから取り出す
    }

    return output;
  }

  static evaluateRPN(postfix) {
    const stack = [];

    for (let token of postfix) {
      if (typeof token === 'number') {
        stack.push(token);  // 数字はそのままスタックに積む
      } else {
        const b = stack.pop();
        const a = stack.pop();
        switch (token) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/': stack.push(a / b); break;
          case '^': stack.push(Math.pow(a, b)); break;
        }
      }
    }

    return stack.pop();  // 最後に残った値が結果
  }

  // 行列演算
  static Matrix = class {
    constructor(data) {
      this.data = data;
    }

    static add(A, B) {
      if (A.data.length !== B.data.length || A.data[0].length !== B.data[0].length) {
        throw new Error('行列のサイズが一致しません');
      }

      const result = [];
      for (let i = 0; i < A.data.length; i++) {
        result.push([]);
        for (let j = 0; j < A.data[i].length; j++) {
          result[i].push(A.data[i][j] + B.data[i][j]);
        }
      }
      return new AdvancedMath.Matrix(result);
    }

    static multiply(A, B) {
      if (A.data[0].length !== B.data.length) {
        throw new Error('行列のサイズが一致しません');
      }

      const result = [];
      for (let i = 0; i < A.data.length; i++) {
        result.push([]);
        for (let j = 0; j < B.data[0].length; j++) {
          let sum = 0;
          for (let k = 0; k < A.data[i].length; k++) {
            sum += A.data[i][k] * B.data[k][j];
          }
          result[i].push(sum);
        }
      }
      return new AdvancedMath.Matrix(result);
    }

    static transpose(A) {
      const result = [];
      for (let i = 0; i < A.data[0].length; i++) {
        result.push([]);
        for (let j = 0; j < A.data.length; j++) {
          result[i].push(A.data[j][i]);
        }
      }
      return new AdvancedMath.Matrix(result);
    }

    static determinant(A) {
      if (A.data.length !== A.data[0].length) {
        throw new Error("行列は正方行列でなければなりません");
      }

      const n = A.data.length;
      if (n === 2) {
        return A.data[0][0] * A.data[1][1] - A.data[0][1] * A.data[1][0];
      }

      let det = 0;
      for (let i = 0; i < n; i++) {
        const subMatrix = A.data.slice(1).map(row => row.filter((_, j) => j !== i));
        det += (i % 2 === 0 ? 1 : -1) * A.data[0][i] * AdvancedMath.Matrix.determinant(new AdvancedMath.Matrix(subMatrix));
      }
      return det;
    }
  };
}

// 使用例
function sample(){
// 基本的な計算
console.log(AdvancedMath.add(3, 5)); // 8
console.log(AdvancedMath.sqrt(16)); // 4

// 数式の計算
console.log(AdvancedMath.evaluateExpression("3 + 5 * (2 - 8)")); // -13

// 行列計算
const matrixA = new AdvancedMath.Matrix([[1, 2], [3, 4]]);
const matrixB = new AdvancedMath.Matrix([[5, 6], [7, 8]]);
const resultMatrix = AdvancedMath.Matrix.multiply(matrixA, matrixB);
console.log(resultMatrix.data); // [[19, 22], [43, 50]]

// 行列の転置
const transposed = AdvancedMath.Matrix.transpose(matrixA);
console.log(transposed.data); // [[1, 3], [2, 4]]
}

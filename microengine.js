CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  return this.closePath();
};

CanvasRenderingContext2D.prototype.fillRoundRect = function(x, y, w, h, r) {
  this.roundRect(x, y, w, h, r);
  return this.fill();
};

CanvasRenderingContext2D.prototype.strokeRoundRect = function(x, y, w, h, r) {
  this.roundRect(x, y, w, h, r);
  return this.stroke();
};

var Random;

Random = (function() {
  function Random(_seed) {
    this._seed = _seed != null ? _seed : Math.random();
    if (this._seed === 0) {
      this._seed = Math.random();
    }
    if (this._seed < 1) {
      this._seed *= 1 << 30;
    }
    this.a = 13971;
    this.b = 12345;
    this.size = 1 << 30;
    this.mask = this.size - 1;
    this.norm = 1 / this.size;
    this.nextSeed();
    this.nextSeed();
    this.nextSeed();
  }

  Random.prototype.next = function() {
    this._seed = (this._seed * this.a + this.b) & this.mask;
    return this._seed * this.norm;
  };

  Random.prototype.nextInt = function(num) {
    return Math.floor(this.next() * num);
  };

  Random.prototype.nextSeed = function() {
    return this._seed = (this._seed * this.a + this.b) & this.mask;
  };

  Random.prototype.seed = function(_seed) {
    this._seed = _seed != null ? _seed : Math.random();
    if (this._seed < 1) {
      this._seed *= 1 << 30;
    }
    this.nextSeed();
    this.nextSeed();
    return this.nextSeed();
  };

  return Random;

})();

this.MicroVM = (function() {
  function MicroVM(meta, global, namespace1, preserve_ls) {
    var ctx, err;
    if (meta == null) {
      meta = {};
    }
    if (global == null) {
      global = {};
    }
    this.namespace = namespace1 != null ? namespace1 : "/microstudio";
    this.preserve_ls = preserve_ls != null ? preserve_ls : false;
    if (meta.print == null) {
      meta.print = function(text) {
        if (typeof text === "object") {
          text = Program.toString(text);
        }
        return console.info(text);
      };
    }
    Array.prototype.insert = function(e) {
      this.splice(0, 0, e);
      return e;
    };
    Array.prototype.insertAt = function(e, i) {
      if (i >= 0 && i < this.length) {
        this.splice(i, 0, e);
      } else {
        this.push(e);
      }
      return e;
    };
    Array.prototype.remove = function(i) {
      if (i >= 0 && i < this.length) {
        return this.splice(i, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.removeAt = function(i) {
      if (i >= 0 && i < this.length) {
        return this.splice(i, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.removeElement = function(e) {
      var index;
      index = this.indexOf(e);
      if (index >= 0) {
        return this.splice(index, 1)[0];
      } else {
        return 0;
      }
    };
    Array.prototype.contains = function(e) {
      if (this.indexOf(e) >= 0) {
        return 1;
      } else {
        return 0;
      }
    };
    meta.round = function(x) {
      return Math.round(x);
    };
    meta.floor = function(x) {
      return Math.floor(x);
    };
    meta.ceil = function(x) {
      return Math.ceil(x);
    };
    meta.abs = function(x) {
      return Math.abs(x);
    };
    meta.min = function(x, y) {
      return Math.min(x, y);
    };
    meta.max = function(x, y) {
      return Math.max(x, y);
    };
    meta.sqrt = function(x) {
      return Math.sqrt(x);
    };
    meta.pow = function(x, y) {
      return Math.pow(x, y);
    };
    meta.sin = function(x) {
      return Math.sin(x);
    };
    meta.cos = function(x) {
      return Math.cos(x);
    };
    meta.tan = function(x) {
      return Math.tan(x);
    };
    meta.acos = function(x) {
      return Math.acos(x);
    };
    meta.asin = function(x) {
      return Math.asin(x);
    };
    meta.atan = function(x) {
      return Math.atan(x);
    };
    meta.atan2 = function(y, x) {
      return Math.atan2(y, x);
    };
    meta.sind = function(x) {
      return Math.sin(x / 180 * Math.PI);
    };
    meta.cosd = function(x) {
      return Math.cos(x / 180 * Math.PI);
    };
    meta.tand = function(x) {
      return Math.tan(x / 180 * Math.PI);
    };
    meta.acosd = function(x) {
      return Math.acos(x) * 180 / Math.PI;
    };
    meta.asind = function(x) {
      return Math.asin(x) * 180 / Math.PI;
    };
    meta.atand = function(x) {
      return Math.atan(x) * 180 / Math.PI;
    };
    meta.atan2d = function(y, x) {
      return Math.atan2(y, x) * 180 / Math.PI;
    };
    meta.log = function(x) {
      return Math.log(x);
    };
    meta.exp = function(x) {
      return Math.exp(x);
    };
    meta.random = new Random(0);
    meta.PI = Math.PI;
    meta["true"] = 1;
    meta["false"] = 0;
    global.system = {
      time: Date.now,
      language: navigator.language,
      inputs: {
        keyboard: 1,
        mouse: 1,
        touch: "ontouchstart" in window ? 1 : 0,
        gamepad: 0
      },
      prompt: (function(_this) {
        return function(text, callback) {
          return setTimeout((function() {
            var args, result;
            global.mouse.pressed = 0;
            global.touch.touching = 0;
            result = window.prompt(text);
            if ((callback != null) && callback instanceof Program.Function) {
              args = [(result != null ? 1 : 0), result];
              return _this.call(callback, args);
            }
          }), 0);
        };
      })(this),
      say: (function(_this) {
        return function(text) {
          return setTimeout((function() {
            return window.alert(text);
          }), 0);
        };
      })(this)
    };
    try {
      global.system.inputs.keyboard = window.matchMedia("(pointer:fine)").matches ? 1 : 0;
      global.system.inputs.mouse = window.matchMedia("(any-hover:none)").matches ? 0 : 1;
    } catch (error1) {
      err = error1;
    }
    this.storage_service = this.createStorageService();
    global.storage = this.storage_service.api;
    meta.global = global;
    this.context = {
      meta: meta,
      global: global,
      local: global,
      object: global,
      breakable: 0,
      continuable: 0,
      returnable: 0,
      stack_size: 0
    };
    ctx = this.context;
    Array.prototype.sortList = function(f) {
      var funk;
      if ((f != null) && f instanceof Program.Function) {
        funk = function(a, b) {
          return f.call(ctx, [a, b], true);
        };
      } else if ((f != null) && typeof f === "function") {
        funk = f;
      }
      return this.sort(funk);
    };
    this.clearWarnings();
    this.runner = new Runner(this);
  }

  MicroVM.prototype.clearWarnings = function() {
    return this.context.warnings = {
      using_undefined_variable: {},
      assigning_field_to_undefined: {},
      invoking_non_function: {}
    };
  };

  MicroVM.prototype.setMeta = function(key, value) {
    return this.context.meta[key] = value;
  };

  MicroVM.prototype.setGlobal = function(key, value) {
    return this.context.global[key] = value;
  };

  MicroVM.prototype.run = function(program, timeout, filename) {
    var err, res;
    this.program = program;
    if (timeout == null) {
      timeout = 3000;
    }
    if (filename == null) {
      filename = "";
    }
    this.error_info = null;
    this.context.timeout = Date.now() + timeout;
    this.context.stack_size = 0;
    try {
      res = this.runner.run(this.program, filename);
      this.storage_service.check();
      return Program.toString(res);
    } catch (error1) {
      err = error1;
      if ((err.type != null) && (err.line != null) && (err.error != null)) {
        this.error_info = err;
      } else if ((this.context.location != null) && (this.context.location.token != null)) {
        this.error_info = {
          error: err,
          file: filename,
          line: this.context.location.token.line,
          column: this.context.location.token.column
        };
        console.info("Error at line: " + this.context.location.token.line + " column: " + this.context.location.token.column);
      } else {
        this.error_info = {
          error: err,
          file: filename
        };
      }
      console.error(err);
      return this.storage_service.check();
    }
  };

  MicroVM.prototype.call = function(name, args, timeout) {
    var err, res;
    if (args == null) {
      args = [];
    }
    if (timeout == null) {
      timeout = 3000;
    }
    this.error_info = null;
    this.context.timeout = Date.now() + timeout;
    this.context.stack_size = 0;
    try {
      res = this.runner.call(name, args);
      this.storage_service.check();
      return res;
    } catch (error1) {
      err = error1;
      console.error(err);
      if ((this.context.location != null) && (this.context.location.token != null)) {
        this.error_info = {
          error: err,
          line: this.context.location.token.line,
          column: this.context.location.token.column,
          file: this.context.location.token.file
        };
      } else {
        this.error_info = {
          error: err
        };
      }
      if ((this.context.location != null) && (this.context.location.token != null)) {
        console.info("Error at line: " + this.context.location.token.line + " column: " + this.context.location.token.column);
      }
      return this.storage_service.check();
    }
  };

  MicroVM.prototype.createStorageService = function() {
    var err, error, ls, namespace, s, service, storage, write_storage;
    try {
      ls = window.localStorage;
    } catch (error1) {
      error = error1;
      console.info("localStorage not available");
      return service = {
        api: {
          set: function() {},
          get: function() {
            return 0;
          }
        },
        check: function() {}
      };
    }
    if (!this.preserve_ls) {
      try {
        delete window.localStorage;
      } catch (error1) {
        err = error1;
      }
    }
    storage = {};
    write_storage = false;
    namespace = this.namespace;
    try {
      s = ls.getItem("ms" + namespace);
      if (s) {
        storage = JSON.parse(s);
      }
    } catch (error1) {
      err = error1;
    }
    return service = {
      api: {
        set: (function(_this) {
          return function(name, value) {
            value = _this.storableObject(value);
            if ((name != null) && (value != null)) {
              storage[name] = value;
              write_storage = true;
            }
            return value;
          };
        })(this),
        get: (function(_this) {
          return function(name) {
            if (name != null) {
              return storage[name];
            } else {
              return 0;
            }
          };
        })(this)
      },
      check: (function(_this) {
        return function() {
          if (write_storage) {
            write_storage = false;
            try {
              return ls.setItem("ms" + namespace, JSON.stringify(storage));
            } catch (error1) {
              err = error1;
            }
          }
        };
      })(this)
    };
  };

  MicroVM.prototype.storableObject = function(value) {
    var referenced;
    referenced = [this.context.global.screen, this.context.global.system, this.context.global.keyboard, this.context.global.audio, this.context.global.gamepad, this.context.global.touch, this.context.global.mouse, this.context.global.sprites, this.context.global.maps];
    return this.makeStorableObject(value, referenced);
  };

  MicroVM.prototype.makeStorableObject = function(value, referenced) {
    var i, j, key, len, res, v;
    if (value == null) {
      return value;
    }
    if (typeof value === "function" || value instanceof Program.Function) {
      return void 0;
    } else if (typeof value === "object") {
      if (referenced.indexOf(value) >= 0) {
        return void 0;
      }
      referenced = referenced.slice();
      referenced.push(value);
      if (Array.isArray(value)) {
        res = [];
        for (i = j = 0, len = value.length; j < len; i = ++j) {
          v = value[i];
          v = this.makeStorableObject(v, referenced);
          if (v != null) {
            res[i] = v;
          }
        }
        return res;
      } else {
        res = {};
        for (key in value) {
          v = value[key];
          v = this.makeStorableObject(v, referenced);
          if (v != null) {
            res[key] = v;
          }
        }
        return res;
      }
    } else {
      return value;
    }
  };

  return MicroVM;

})();

this.Tokenizer = (function() {
  function Tokenizer(input, filename) {
    this.input = input;
    this.filename = filename;
    this.index = 0;
    this.line = 1;
    this.column = 0;
    this.last_column = 0;
    this.buffer = [];
    this.chars = {};
    this.chars["("] = Token.TYPE_OPEN_BRACE;
    this.chars[")"] = Token.TYPE_CLOSED_BRACE;
    this.chars["["] = Token.TYPE_OPEN_BRACKET;
    this.chars["]"] = Token.TYPE_CLOSED_BRACKET;
    this.chars["{"] = Token.TYPE_OPEN_CURLY_BRACE;
    this.chars["}"] = Token.TYPE_CLOSED_CURLY_BRACE;
    this.chars["^"] = Token.TYPE_POWER;
    this.chars[","] = Token.TYPE_COMMA;
    this.chars["."] = Token.TYPE_DOT;
    this.chars["%"] = Token.TYPE_MODULO;
    this.doubles = {};
    this.doubles[">"] = [Token.TYPE_GREATER, Token.TYPE_GREATER_OR_EQUALS];
    this.doubles["<"] = [Token.TYPE_LOWER, Token.TYPE_LOWER_OR_EQUALS];
    this.doubles["="] = [Token.TYPE_EQUALS, Token.TYPE_DOUBLE_EQUALS];
    this.doubles["+"] = [Token.TYPE_PLUS, Token.TYPE_PLUS_EQUALS];
    this.doubles["-"] = [Token.TYPE_MINUS, Token.TYPE_MINUS_EQUALS];
    this.doubles["*"] = [Token.TYPE_MULTIPLY, Token.TYPE_MULTIPLY_EQUALS];
    this.doubles["/"] = [Token.TYPE_DIVIDE, Token.TYPE_DIVIDE_EQUALS];
  }

  Tokenizer.prototype.pushBack = function(token) {
    return this.buffer.splice(0, 0, token);
  };

  Tokenizer.prototype.finished = function() {
    return this.index >= this.input.length;
  };

  Tokenizer.prototype.nextChar = function(ignore_comments) {
    var c;
    if (ignore_comments == null) {
      ignore_comments = false;
    }
    c = this.input.charAt(this.index++);
    if (c === "\n") {
      this.line += 1;
      this.last_column = this.column;
      this.column = 0;
    } else if (c === "/" && !ignore_comments) {
      if (this.input.charAt(this.index) === "/") {
        while (true) {
          c = this.input.charAt(this.index++);
          if (c === "\n" || this.index >= this.input.length) {
            break;
          }
        }
        this.line += 1;
        this.last_column = this.column;
        this.column = 0;
        return this.nextChar();
      }
    } else {
      this.column += 1;
    }
    return c;
  };

  Tokenizer.prototype.rewind = function() {
    this.index -= 1;
    this.column -= 1;
    if (this.input.charAt(this.index) === "\n") {
      this.line -= 1;
      return this.column = this.last_column;
    }
  };

  Tokenizer.prototype.next = function() {
    var c, code;
    if (this.buffer.length > 0) {
      return this.buffer.splice(0, 1)[0];
    }
    while (true) {
      if (this.index >= this.input.length) {
        return null;
      }
      c = this.nextChar();
      code = c.charCodeAt(0);
      if (code > 32) {
        break;
      }
    }
    this.token_start = this.index - 1;
    if (this.doubles[c] != null) {
      return this.parseDouble(c, this.doubles[c]);
    }
    if (this.chars[c] != null) {
      return new Token(this, this.chars[c], c);
    }
    if (c === "!") {
      return this.parseUnequals(c);
    } else if (code >= 48 && code <= 57) {
      return this.parseNumber(c);
    } else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95) {
      return this.parseIdentifier(c);
    } else if (c === '"') {
      return this.parseString(c, '"');
    } else if (c === "'") {
      return this.parseString(c, "'");
    } else {
      return this.error("Syntax Error");
    }
  };

  Tokenizer.prototype.changeNumberToIdentifier = function() {
    var i, j, ref, results, token, v;
    token = this.next();
    if ((token != null) && token.type === Token.TYPE_NUMBER) {
      v = token.string_value.split(".");
      results = [];
      for (i = j = ref = v.length - 1; j >= 0; i = j += -1) {
        if (v[i].length > 0) {
          this.pushBack(new Token(this, Token.TYPE_IDENTIFIER, v[i]));
        }
        if (i > 0) {
          results.push(this.pushBack(new Token(this, Token.TYPE_DOT, ".")));
        } else {
          results.push(void 0);
        }
      }
      return results;
    } else if ((token != null) && token.type === Token.TYPE_STRING) {
      return this.pushBack(new Token(this, Token.TYPE_IDENTIFIER, token.value));
    } else {
      return this.pushBack(token);
    }
  };

  Tokenizer.prototype.parseDouble = function(c, d) {
    if (this.index < this.input.length && this.input.charAt(this.index) === "=") {
      this.nextChar();
      return new Token(this, d[1], c + "=");
    } else {
      return new Token(this, d[0], c);
    }
  };

  Tokenizer.prototype.parseEquals = function(c) {
    if (this.index < this.input.length && this.input.charAt(this.index) === "=") {
      this.nextChar();
      return new Token(this, Token.TYPE_DOUBLE_EQUALS, "==");
    } else {
      return new Token(this, Token.TYPE_EQUALS, "=");
    }
  };

  Tokenizer.prototype.parseGreater = function(c) {
    if (this.index < this.input.length && this.input.charAt(this.index) === "=") {
      this.nextChar();
      return new Token(this, Token.TYPE_GREATER_OR_EQUALS, ">=");
    } else {
      return new Token(this, Token.TYPE_GREATER_OR_EQUALS, ">");
    }
  };

  Tokenizer.prototype.parseLower = function(c) {
    if (this.index < this.input.length && this.input.charAt(this.index) === "=") {
      this.nextChar();
      return new Token(this, Token.TYPE_LOWER_OR_EQUALS, "<=");
    } else {
      return new Token(this, Token.TYPE_LOWER, "<");
    }
  };

  Tokenizer.prototype.parseUnequals = function(c) {
    if (this.index < this.input.length && this.input.charAt(this.index) === "=") {
      this.nextChar();
      return new Token(this, Token.TYPE_UNEQUALS, "!=");
    } else {
      return this.error("Expected inequality !=");
    }
  };

  Tokenizer.prototype.parseIdentifier = function(s) {
    var c, code;
    while (true) {
      if (this.index >= this.input.length) {
        return new Token(this, Token.TYPE_IDENTIFIER, s);
      }
      c = this.nextChar();
      code = c.charCodeAt(0);
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code === 95 || (code >= 48 && code <= 57)) {
        s += c;
      } else {
        this.rewind();
        return new Token(this, Token.TYPE_IDENTIFIER, s);
      }
    }
  };

  Tokenizer.prototype.parseNumber = function(s) {
    var c, code, pointed;
    pointed = false;
    while (true) {
      if (this.index >= this.input.length) {
        return new Token(this, Token.TYPE_NUMBER, (pointed ? Number.parseFloat(s) : Number.parseInt(s)), s);
      }
      c = this.nextChar();
      code = c.charCodeAt(0);
      if (c === "." && !pointed) {
        pointed = true;
        s += c;
      } else if (code >= 48 && code <= 57) {
        s += c;
      } else {
        this.rewind();
        return new Token(this, Token.TYPE_NUMBER, (pointed ? Number.parseFloat(s) : Number.parseInt(s)), s);
      }
    }
  };

  Tokenizer.prototype.parseString = function(s, close) {
    var c, code, n;
    if (close == null) {
      close = '"';
    }
    while (true) {
      if (this.index >= this.input.length) {
        return this.error("Unclosed string value");
      }
      c = this.nextChar(true);
      code = c.charCodeAt(0);
      if (c === close) {
        n = this.nextChar(true);
        if (n === close) {
          s += c;
        } else {
          this.rewind();
          s += c;
          return new Token(this, Token.TYPE_STRING, s.substring(1, s.length - 1));
        }
      } else {
        s += c;
      }
    }
  };

  Tokenizer.prototype.error = function(s) {
    throw s;
  };

  return Tokenizer;

})();

this.Token = (function() {
  function Token(tokenizer, type, value, string_value) {
    this.tokenizer = tokenizer;
    this.type = type;
    this.value = value;
    this.string_value = string_value;
    this.line = this.tokenizer.line;
    this.column = this.tokenizer.column;
    this.start = this.tokenizer.token_start;
    this.length = this.tokenizer.index - this.start;
    this.index = this.tokenizer.index;
    if (this.type === Token.TYPE_IDENTIFIER && Token.predefined.hasOwnProperty(this.value)) {
      this.type = Token.predefined[this.value];
      this.reserved_keyword = true;
    }
    this.is_binary_operator = (this.type >= 30 && this.type <= 35) || (this.type >= 200 && this.type <= 201) || (this.type >= 2 && this.type <= 7);
  }

  Token.prototype.toString = function() {
    return this.value + " : " + this.type;
  };

  return Token;

})();

this.Token.TYPE_EQUALS = 1;

this.Token.TYPE_DOUBLE_EQUALS = 2;

this.Token.TYPE_GREATER = 3;

this.Token.TYPE_GREATER_OR_EQUALS = 4;

this.Token.TYPE_LOWER = 5;

this.Token.TYPE_LOWER_OR_EQUALS = 6;

this.Token.TYPE_UNEQUALS = 7;

this.Token.TYPE_IDENTIFIER = 10;

this.Token.TYPE_NUMBER = 11;

this.Token.TYPE_STRING = 12;

this.Token.TYPE_OPEN_BRACE = 20;

this.Token.TYPE_CLOSED_BRACE = 21;

this.Token.TYPE_OPEN_CURLY_BRACE = 22;

this.Token.TYPE_CLOSED_CURLY_BRACE = 23;

this.Token.TYPE_OPEN_BRACKET = 24;

this.Token.TYPE_CLOSED_BRACKET = 25;

this.Token.TYPE_COMMA = 26;

this.Token.TYPE_DOT = 27;

this.Token.TYPE_PLUS = 30;

this.Token.TYPE_MINUS = 31;

this.Token.TYPE_MULTIPLY = 32;

this.Token.TYPE_DIVIDE = 33;

this.Token.TYPE_POWER = 34;

this.Token.TYPE_MODULO = 35;

this.Token.TYPE_PLUS_EQUALS = 40;

this.Token.TYPE_MINUS_EQUALS = 41;

this.Token.TYPE_MULTIPLY_EQUALS = 42;

this.Token.TYPE_DIVIDE_EQUALS = 43;

this.Token.TYPE_RETURN = 50;

this.Token.TYPE_BREAK = 51;

this.Token.TYPE_CONTINUE = 52;

this.Token.TYPE_FUNCTION = 60;

this.Token.TYPE_LOCAL = 70;

this.Token.TYPE_OBJECT = 80;

this.Token.TYPE_CLASS = 90;

this.Token.TYPE_EXTENDS = 91;

this.Token.TYPE_NEW = 92;

this.Token.TYPE_FOR = 100;

this.Token.TYPE_TO = 101;

this.Token.TYPE_BY = 102;

this.Token.TYPE_IN = 103;

this.Token.TYPE_WHILE = 104;

this.Token.TYPE_IF = 105;

this.Token.TYPE_THEN = 106;

this.Token.TYPE_ELSE = 107;

this.Token.TYPE_ELSIF = 108;

this.Token.TYPE_END = 120;

this.Token.TYPE_AND = 200;

this.Token.TYPE_OR = 201;

this.Token.TYPE_NOT = 202;

this.Token.TYPE_ERROR = 404;

this.Token.predefined = {};

this.Token.predefined["return"] = this.Token.TYPE_RETURN;

this.Token.predefined["break"] = this.Token.TYPE_BREAK;

this.Token.predefined["continue"] = this.Token.TYPE_CONTINUE;

this.Token.predefined["function"] = this.Token.TYPE_FUNCTION;

this.Token.predefined["for"] = this.Token.TYPE_FOR;

this.Token.predefined["to"] = this.Token.TYPE_TO;

this.Token.predefined["by"] = this.Token.TYPE_BY;

this.Token.predefined["in"] = this.Token.TYPE_IN;

this.Token.predefined["while"] = this.Token.TYPE_WHILE;

this.Token.predefined["if"] = this.Token.TYPE_IF;

this.Token.predefined["then"] = this.Token.TYPE_THEN;

this.Token.predefined["else"] = this.Token.TYPE_ELSE;

this.Token.predefined["elsif"] = this.Token.TYPE_ELSIF;

this.Token.predefined["end"] = this.Token.TYPE_END;

this.Token.predefined["object"] = this.Token.TYPE_OBJECT;

this.Token.predefined["class"] = this.Token.TYPE_CLASS;

this.Token.predefined["extends"] = this.Token.TYPE_EXTENDS;

this.Token.predefined["new"] = this.Token.TYPE_NEW;

this.Token.predefined["and"] = this.Token.TYPE_AND;

this.Token.predefined["or"] = this.Token.TYPE_OR;

this.Token.predefined["not"] = this.Token.TYPE_NOT;

this.Token.predefined["local"] = this.Token.TYPE_LOCAL;

this.Parser = (function() {
  function Parser(input, filename) {
    this.input = input;
    this.filename = filename != null ? filename : "";
    this.tokenizer = new Tokenizer(this.input, this.filename);
    this.program = new Program();
    this.current_block = [];
    this.current = {
      line: 1,
      column: 1
    };
    this.verbose = false;
    this.nesting = 0;
    this.not_terminated = [];
  }

  Parser.prototype.nextToken = function() {
    var token;
    token = this.tokenizer.next();
    if (token == null) {
      this.unexpected_eof = true;
      throw "Unexpected end of file";
    }
    return this.current = token;
  };

  Parser.prototype.nextTokenOptional = function() {
    var token;
    token = this.tokenizer.next();
    if (token != null) {
      this.current = token;
    }
    return token;
  };

  Parser.prototype.parse = function() {
    var err, expression, nt, token;
    try {
      while (true) {
        expression = this.parseLine();
        if ((expression == null) && !this.tokenizer.finished()) {
          token = this.tokenizer.next();
          if ((token != null) && token.reserved_keyword) {
            this.error("Misuse of reserved keyword: '" + token.value + "'");
          } else {
            this.error("Unexpected data");
          }
        }
        if (expression === null) {
          break;
        }
        this.current_block.push(expression);
        this.program.add(expression);
        if (this.verbose) {
          console.info(expression);
        }
      }
      return this;
    } catch (error1) {
      err = error1;
      if (this.not_terminated.length > 0 && err === "Unexpected end of file") {
        nt = this.not_terminated[this.not_terminated.length - 1];
        return this.error_info = {
          error: "Unterminated '" + nt.value + "' ; no matching 'end' found",
          line: nt.line,
          column: nt.column
        };
      } else {
        return this.error_info = {
          error: err,
          line: this.current.line,
          column: this.current.column
        };
      }
    }
  };

  Parser.prototype.parseLine = function() {
    var token;
    token = this.nextTokenOptional();
    if (token == null) {
      return null;
    }
    switch (token.type) {
      case Token.TYPE_RETURN:
        return new Program.Return(token, this.parseExpression());
      case Token.TYPE_BREAK:
        return new Program.Break(token);
      case Token.TYPE_CONTINUE:
        return new Program.Continue(token);
      case Token.TYPE_LOCAL:
        return this.parseLocalAssignment(token);
      default:
        this.tokenizer.pushBack(token);
        return this.parseExpression();
    }
  };

  Parser.prototype.parseExpression = function(filter) {
    var access, expression;
    expression = this.parseExpressionStart();
    if (expression == null) {
      return null;
    }
    while (true) {
      access = this.parseExpressionSuffix(expression, filter);
      if (access == null) {
        return expression;
      }
      expression = access;
    }
  };

  Parser.prototype.assertExpression = function(filter) {
    var exp;
    exp = this.parseExpression(filter);
    if (exp == null) {
      throw "Expression expected";
    }
    return exp;
  };

  Parser.prototype.parseExpressionSuffix = function(expression, filter) {
    var field, identifier, token;
    token = this.nextTokenOptional();
    if (token == null) {
      return (filter === "self" ? expression : null);
    }
    switch (token.type) {
      case Token.TYPE_DOT:
        if (expression instanceof Program.Value && expression.type === Program.Value.TYPE_NUMBER) {
          this.tokenizer.pushBack(token);
          return null;
        } else {
          this.tokenizer.changeNumberToIdentifier();
          identifier = this.assertBroadIdentifier("Expected identifier");
          return Program.CreateFieldAccess(token, expression, new Program.Value(identifier, Program.Value.TYPE_STRING, identifier.value));
        }
        break;
      case Token.TYPE_OPEN_BRACKET:
        field = this.assertExpression();
        this.assert(Token.TYPE_CLOSED_BRACKET, "Expected ']'");
        return Program.CreateFieldAccess(token, expression, field);
      case Token.TYPE_OPEN_BRACE:
        return this.parseFunctionCall(token, expression);
      case Token.TYPE_EQUALS:
        return this.parseAssignment(token, expression);
      case Token.TYPE_PLUS_EQUALS:
        return this.parseSelfAssignment(token, expression, token.type);
      case Token.TYPE_MINUS_EQUALS:
        return this.parseSelfAssignment(token, expression, token.type);
      case Token.TYPE_MULTIPLY_EQUALS:
        return this.parseSelfAssignment(token, expression, token.type);
      case Token.TYPE_DIVIDE_EQUALS:
        return this.parseSelfAssignment(token, expression, token.type);
      default:
        if (filter === "self") {
          this.tokenizer.pushBack(token);
          return expression;
        } else if (token.is_binary_operator && filter !== "noop") {
          return this.parseBinaryOperation(token, expression);
        } else {
          this.tokenizer.pushBack(token);
          return null;
        }
    }
  };

  Parser.prototype.parseExpressionStart = function() {
    var next, token;
    token = this.nextTokenOptional();
    if (token == null) {
      return null;
    }
    switch (token.type) {
      case Token.TYPE_IDENTIFIER:
        return new Program.Variable(token, token.value);
      case Token.TYPE_NUMBER:
        return this.parseNumberExpression(token);
      case Token.TYPE_PLUS:
        return this.assertExpression();
      case Token.TYPE_MINUS:
        return this.parseExpressionSuffix(new Program.Negate(token, this.assertExpression("noop")), "self");
      case Token.TYPE_NOT:
        return this.parseExpressionSuffix(new Program.Not(token, this.assertExpression("noop")), "self");
      case Token.TYPE_STRING:
        return this.parseStringExpression(token);
      case Token.TYPE_IF:
        return this.parseIf(token);
      case Token.TYPE_FOR:
        return this.parseFor(token);
      case Token.TYPE_WHILE:
        return this.parseWhile(token);
      case Token.TYPE_OPEN_BRACE:
        return this.parseBracedExpression(token);
      case Token.TYPE_OPEN_BRACKET:
        return this.parseArray(token);
      case Token.TYPE_FUNCTION:
        return this.parseFunction(token);
      case Token.TYPE_OBJECT:
        return this.parseObject(token);
      case Token.TYPE_CLASS:
        return this.parseClass(token);
      case Token.TYPE_NEW:
        return this.parseNew(token);
      case Token.TYPE_DOT:
        next = this.assert(Token.TYPE_NUMBER, "malformed number");
        if (!Number.isInteger(next.value)) {
          throw "malformed number";
        }
        return new Program.Value(token, Program.Value.TYPE_NUMBER, Number.parseFloat("." + next.string_value));
      default:
        this.tokenizer.pushBack(token);
        return null;
    }
  };

  Parser.prototype.parseNumberExpression = function(number) {
    return new Program.Value(number, Program.Value.TYPE_NUMBER, number.value);
  };

  Parser.prototype.parseStringExpression = function(string) {
    var token;
    token = this.nextTokenOptional();
    if (token == null) {
      return new Program.Value(string, Program.Value.TYPE_STRING, string.value);
    } else {
      this.tokenizer.pushBack(token);
      return new Program.Value(string, Program.Value.TYPE_STRING, string.value);
    }
  };

  Parser.prototype.parseArray = function(bracket) {
    var res, token;
    res = [];
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_CLOSED_BRACKET) {
        return new Program.Value(bracket, Program.Value.TYPE_ARRAY, res);
      } else if (token.type === Token.TYPE_COMMA) {
        continue;
      } else {
        this.tokenizer.pushBack(token);
        res.push(this.assertExpression());
      }
    }
  };

  Parser.prototype.parseBinaryOperation = function(operation, term1) {
    var ops, terms, token;
    ops = [new Program.Operation(operation, operation.value)];
    terms = [term1];
    terms.push(this.assertExpression("noop"));
    while (true) {
      token = this.nextTokenOptional();
      if (token == null) {
        break;
      }
      if (!token.is_binary_operator) {
        this.tokenizer.pushBack(token);
        break;
      }
      ops.push(new Program.Operation(token, token.value));
      terms.push(this.assertExpression("noop"));
    }
    return Program.BuildOperations(ops, terms);
  };

  Parser.prototype.parseAssignment = function(token, expression) {
    return new Program.Assignment(token, expression, this.assertExpression());
  };

  Parser.prototype.parseSelfAssignment = function(token, expression, operation) {
    return new Program.SelfAssignment(token, expression, operation, this.assertExpression());
  };

  Parser.prototype.parseLocalAssignment = function(local) {
    var identifier;
    identifier = this.assert(Token.TYPE_IDENTIFIER, "Expected identifier");
    this.assert(Token.TYPE_EQUALS, "Expected '='");
    return new Program.Assignment(local, new Program.Variable(identifier, identifier.value), this.assertExpression(), true);
  };

  Parser.prototype.parseBracedExpression = function(open) {
    var expression, token;
    expression = this.assertExpression();
    token = this.nextToken();
    if (token.type === Token.TYPE_CLOSED_BRACE) {
      return new Program.Braced(open, expression);
    } else {
      return this.error("missing closing parenthese");
    }
  };

  Parser.prototype.parseFunctionCall = function(brace_token, expression) {
    var args, start, token;
    args = [];
    this.last_function_call = new Program.FunctionCall(brace_token, expression, args);
    this.last_function_call.argslimits = [];
    while (true) {
      token = this.nextTokenOptional();
      if (token == null) {
        return this.error("missing closing parenthese");
      } else if (token.type === Token.TYPE_CLOSED_BRACE) {
        return new Program.FunctionCall(token, expression, args);
      } else if (token.type === Token.TYPE_COMMA) {
        continue;
      } else {
        this.tokenizer.pushBack(token);
        start = token.start;
        args.push(this.assertExpression());
        this.last_function_call.argslimits.push({
          start: start,
          end: this.tokenizer.index - 1
        });
      }
    }
  };

  Parser.prototype.addTerminable = function(token) {
    return this.not_terminated.push(token);
  };

  Parser.prototype.endTerminable = function() {
    if (this.not_terminated.length > 0) {
      this.not_terminated.splice(this.not_terminated.length - 1, 1);
    }
  };

  Parser.prototype.parseFunction = function(funk) {
    var args, line, sequence, token;
    this.nesting += 1;
    this.addTerminable(funk);
    args = this.parseFunctionArgs();
    sequence = [];
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_END) {
        this.nesting -= 1;
        this.endTerminable();
        return new Program.Function(funk, args, sequence, token);
      } else {
        this.tokenizer.pushBack(token);
        line = this.parseLine();
        if (line != null) {
          sequence.push(line);
        } else {
          this.error("Unexpected data while parsing function");
        }
      }
    }
  };

  Parser.prototype.parseFunctionArgs = function() {
    var args, exp, last, token;
    token = this.nextToken();
    args = [];
    last = null;
    if (token.type !== Token.TYPE_OPEN_BRACE) {
      return this.error("Expected opening parenthese");
    }
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_CLOSED_BRACE) {
        return args;
      } else if (token.type === Token.TYPE_COMMA) {
        last = null;
        continue;
      } else if (token.type === Token.TYPE_EQUALS && last === "argument") {
        exp = this.assertExpression();
        args[args.length - 1]["default"] = exp;
      } else if (token.type === Token.TYPE_IDENTIFIER) {
        last = "argument";
        args.push({
          name: token.value
        });
      } else {
        return this.error("Unexpected token");
      }
    }
  };

  Parser.prototype.parseIf = function(iftoken) {
    var chain, current, line, token;
    this.addTerminable(iftoken);
    current = {
      condition: this.assertExpression(),
      sequence: []
    };
    chain = [];
    token = this.nextToken();
    if (token.type !== Token.TYPE_THEN) {
      return this.error("Expected 'then'");
    }
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_ELSIF) {
        chain.push(current);
        current = {
          condition: this.assertExpression(),
          sequence: []
        };
        this.assert(Token.TYPE_THEN, "Expected 'then'");
      } else if (token.type === Token.TYPE_ELSE) {
        current["else"] = [];
      } else if (token.type === Token.TYPE_END) {
        chain.push(current);
        this.endTerminable();
        return new Program.Condition(iftoken, chain);
      } else {
        this.tokenizer.pushBack(token);
        line = this.parseLine();
        if (line == null) {
          throw Error("Unexpected data while parsing if");
        }
        if (current["else"] != null) {
          current["else"].push(line);
        } else {
          current.sequence.push(line);
        }
      }
    }
  };

  Parser.prototype.assert = function(type, error) {
    var token;
    token = this.nextToken();
    if (token.type !== type) {
      throw error;
    }
    return token;
  };

  Parser.prototype.assertBroadIdentifier = function(error) {
    var token;
    token = this.nextToken();
    if (token.type !== Token.TYPE_IDENTIFIER && token.reserved_keyword) {
      token.type = Token.TYPE_IDENTIFIER;
    }
    if (token.type !== Token.TYPE_IDENTIFIER) {
      throw error;
    }
    return token;
  };

  Parser.prototype.error = function(text) {
    throw text;
  };

  Parser.prototype.parseFor = function(fortoken) {
    var iterator, list, range_by, range_from, range_to, token;
    iterator = this.assertExpression();
    if (iterator instanceof Program.Assignment) {
      range_from = iterator.expression;
      iterator = iterator.field;
      token = this.nextToken();
      if (token.type !== Token.TYPE_TO) {
        return this.error("Expected 'to'");
      }
      range_to = this.assertExpression();
      token = this.nextToken();
      if (token.type === Token.TYPE_BY) {
        range_by = this.assertExpression();
      } else {
        range_by = 0;
        this.tokenizer.pushBack(token);
      }
      return new Program.For(fortoken, iterator.identifier, range_from, range_to, range_by, this.parseSequence(fortoken));
    } else if (iterator instanceof Program.Variable) {
      this.assert(Token.TYPE_IN, "Error expected keyword 'in'");
      list = this.assertExpression();
      return new Program.ForIn(fortoken, iterator.identifier, list, this.parseSequence(fortoken));
    } else {
      return this.error("Malformed for loop");
    }
  };

  Parser.prototype.parseWhile = function(whiletoken) {
    var condition;
    condition = this.assertExpression();
    return new Program.While(whiletoken, condition, this.parseSequence(whiletoken));
  };

  Parser.prototype.parseSequence = function(start_token) {
    var line, sequence, token;
    if (start_token != null) {
      this.addTerminable(start_token);
    }
    this.nesting += 1;
    sequence = [];
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_END) {
        if (start_token != null) {
          this.endTerminable();
        }
        this.nesting -= 1;
        return sequence;
      } else {
        this.tokenizer.pushBack(token);
        line = this.parseLine();
        if (line == null) {
          this.error("Unexpected data");
        }
        sequence.push(line);
      }
    }
    return sequence;
  };

  Parser.prototype.parseObject = function(object) {
    var exp, fields, token;
    this.nesting += 1;
    this.addTerminable(object);
    fields = [];
    while (true) {
      token = this.nextToken();
      if (token.type === Token.TYPE_END) {
        this.nesting -= 1;
        this.endTerminable();
        return new Program.CreateObject(object, fields);
      } else {
        if (token.type !== Token.TYPE_IDENTIFIER && token.reserved_keyword) {
          token.type = Token.TYPE_IDENTIFIER;
        }
        if (token.type === Token.TYPE_STRING) {
          token.type = Token.TYPE_IDENTIFIER;
        }
        if (token.type === Token.TYPE_IDENTIFIER) {
          this.assert(Token.TYPE_EQUALS, "Expected '='");
          exp = this.assertExpression();
          fields.push({
            field: token.value,
            value: exp
          });
        } else {
          return this.error("Malformed object");
        }
      }
    }
  };

  Parser.prototype.parseClass = function(object) {
    var exp, ext, fields, token;
    this.nesting += 1;
    this.addTerminable(object);
    fields = [];
    token = this.nextToken();
    if (token.type === Token.TYPE_EXTENDS) {
      ext = this.assertExpression();
      token = this.nextToken();
    }
    while (true) {
      if (token.type === Token.TYPE_END) {
        this.nesting -= 1;
        this.endTerminable();
        return new Program.CreateClass(object, ext, fields);
      } else {
        if (token.type !== Token.TYPE_IDENTIFIER && token.reserved_keyword) {
          token.type = Token.TYPE_IDENTIFIER;
        }
        if (token.type === Token.TYPE_STRING) {
          token.type = Token.TYPE_IDENTIFIER;
        }
        if (token.type === Token.TYPE_IDENTIFIER) {
          this.assert(Token.TYPE_EQUALS, "Expected '='");
          exp = this.assertExpression();
          fields.push({
            field: token.value,
            value: exp
          });
        } else {
          return this.error("Malformed object");
        }
      }
      token = this.nextToken();
    }
  };

  Parser.prototype.parseNew = function(token) {
    var exp;
    exp = this.assertExpression();
    return new Program.NewCall(token, exp);
  };

  return Parser;

})();

this.Program = (function() {
  function Program() {
    this.statements = [];
  }

  Program.prototype.add = function(statement) {
    return this.statements.push(statement);
  };

  Program.prototype.isAssignment = function() {
    return this.statements.length > 0 && this.statements[this.statements.length - 1] instanceof Program.Assignment;
  };

  return Program;

})();

this.Statement = (function() {
  function Statement() {}

  return Statement;

})();

this.Program.Expression = (function() {
  function Expression() {}

  return Expression;

})();

this.Program.Assignment = (function() {
  function Assignment(token1, field1, expression1, local1) {
    this.token = token1;
    this.field = field1;
    this.expression = expression1;
    this.local = local1;
    if (this.expression instanceof Program.CreateClass && this.field instanceof Program.Variable) {
      this.evaluate = (function(_this) {
        return function(context, hold) {
          context.location = _this;
          if (_this.local) {
            return _this.field.hotUpdate(context, context.local, _this.expression.evaluate(context, true));
          } else {
            return _this.field.hotUpdate(context, null, _this.expression.evaluate(context, true));
          }
        };
      })(this);
    }
  }

  Assignment.prototype.evaluate = function(context, hold) {
    context.location = this;
    if (this.local) {
      return this.field.assign(context, context.local, this.expression.evaluate(context, true));
    } else {
      return this.field.assign(context, null, this.expression.evaluate(context, true));
    }
  };

  return Assignment;

})();

this.Program.SelfAssignment = (function() {
  function SelfAssignment(token1, field1, operation, expression1) {
    this.token = token1;
    this.field = field1;
    this.operation = operation;
    this.expression = expression1;
  }

  SelfAssignment.prototype.evaluate = function(context, hold) {
    var exp;
    context.location = this;
    exp = this.expression.evaluate(context, true);
    switch (this.operation) {
      case Token.TYPE_PLUS_EQUALS:
        return this.field.add(context, exp);
      case Token.TYPE_MINUS_EQUALS:
        return this.field.sub(context, exp);
      case Token.TYPE_MULTIPLY_EQUALS:
        return this.field.mul(context, exp);
      case Token.TYPE_DIVIDE_EQUALS:
        return this.field.div(context, exp);
    }
  };

  return SelfAssignment;

})();

this.Program.Value = (function() {
  function Value(token1, type, value1) {
    this.token = token1;
    this.type = type;
    this.value = value1;
    if (this.type === Program.Value.TYPE_ARRAY) {
      this.evaluate = this.evaluateArray;
    }
  }

  Value.prototype.optimize = function() {
    if (this.type !== Program.Value.TYPE_ARRAY) {
      return this.constant = this.value;
    }
  };

  Value.prototype.evaluate = function(context) {
    return this.value;
  };

  Value.prototype.evaluateArray = function(context) {
    var j, len1, ref, res, v;
    res = [];
    ref = this.value;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      v = ref[j];
      res.push(v.evaluate(context, true));
    }
    return res;
  };

  Value.TYPE_NUMBER = 1;

  Value.TYPE_STRING = 2;

  Value.TYPE_ARRAY = 3;

  Value.TYPE_OBJECT = 4;

  Value.TYPE_FUNCTION = 5;

  Value.TYPE_CLASS = 6;

  return Value;

})();

this.Program.CreateFieldAccess = function(token, expression, field) {
  if (expression instanceof Program.Field) {
    expression.appendField(field);
    return expression;
  } else {
    return new Program.Field(token, expression, [field]);
  }
};

this.Program.Variable = (function() {
  function Variable(token1, identifier) {
    this.token = token1;
    this.identifier = identifier;
  }

  Variable.prototype.assign = function(context, scope, value) {
    if (scope == null) {
      if (context.local[this.identifier] != null) {
        scope = context.local;
      } else {
        scope = context.object;
      }
    }
    return scope[this.identifier] = value;
  };

  Variable.prototype.hotUpdate = function(context, scope, value) {
    var key, results, val;
    if (scope == null) {
      if (context.local[this.identifier] != null) {
        scope = context.local;
      } else {
        scope = context.object;
      }
    }
    if (scope[this.identifier] != null) {
      results = [];
      for (key in value) {
        val = value[key];
        results.push(scope[this.identifier][key] = val);
      }
      return results;
    } else {
      return scope[this.identifier] = value;
    }
  };

  Variable.prototype.ensureCreated = function(context) {
    var id, scope, v;
    if (this.identifier === "this") {
      return context.object;
    }
    if (context.meta[this.identifier] != null) {
      scope = context.meta;
    } else if (context.local[this.identifier] != null) {
      scope = context.local;
    } else if ((context.object[this.identifier] != null) || (context.global[this.identifier] == null)) {
      scope = context.object;
    } else {
      scope = context.global;
    }
    v = scope[this.identifier];
    if ((v != null) && (Array.isArray(v) || typeof v === "object")) {
      return v;
    } else {
      id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
      if (!context.warnings.assigning_field_to_undefined[id]) {
        context.warnings.assigning_field_to_undefined[id] = {
          file: this.token.tokenizer.filename,
          line: this.token.line,
          column: this.token.column,
          expression: this.identifier
        };
      }
      return scope[this.identifier] = {};
    }
  };

  Variable.prototype.evaluate = function(context, hold, warn) {
    var c, id, n, obj, v;
    if (warn == null) {
      warn = true;
    }
    if (this.identifier === "this") {
      return context.object;
    }
    if (this.identifier === "super") {
      if ((context.superClass != null) && (context.childName != null)) {
        c = context.superClass;
        n = context.childName;
        while ((c[n] == null) && (c["class"] != null)) {
          c = c["class"];
        }
        this.childName = context.childName;
        this.superClass = c["class"];
        this.parentObject = context.object;
        if (c[n] != null) {
          return c[n];
        } else {
          return 0;
        }
      }
    }
    context.location = this;
    this.scope = null;
    v = context.meta[this.identifier];
    if (v == null) {
      v = context.local[this.identifier];
      if (v == null) {
        obj = context.object;
        v = obj[this.identifier];
        while ((v == null) && (obj["class"] != null)) {
          obj = obj["class"];
          v = obj[this.identifier];
        }
        if (v != null) {
          this.childName = this.identifier;
          this.superClass = obj["class"];
          this.parentObject = context.object;
        }
        if (v != null) {
          this.scope = context.object;
        }
        if (v == null) {
          v = context.global[this.identifier];
        }
      }
    }
    if (v != null) {
      return v;
    } else {
      if (warn) {
        id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
        if (!context.warnings.using_undefined_variable[id]) {
          context.warnings.using_undefined_variable[id] = {
            file: this.token.tokenizer.filename,
            line: this.token.line,
            column: this.token.column,
            expression: this.identifier
          };
        }
      }
      return 0;
    }
  };

  Variable.prototype.getScope = function(context) {
    if (context.local[this.identifier] != null) {
      return context.local;
    } else if (context.object[this.identifier] != null) {
      return context.object;
    } else if (context.global[this.identifier] != null) {
      return context.global;
    } else {
      return null;
    }
  };

  Variable.prototype.add = function(context, value) {
    var id, scope;
    scope = this.getScope(context);
    if (scope == null) {
      id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
      if (!context.warnings.using_undefined_variable[id]) {
        context.warnings.using_undefined_variable[id] = {
          file: this.token.tokenizer.filename,
          line: this.token.line,
          column: this.token.column,
          expression: this.identifier
        };
      }
      return context.global[this.identifier] = 0 + value;
    } else {
      return scope[this.identifier] += value;
    }
  };

  Variable.prototype.sub = function(context, value) {
    var id, scope;
    scope = this.getScope(context);
    if (scope == null) {
      id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
      if (!context.warnings.using_undefined_variable[id]) {
        context.warnings.using_undefined_variable[id] = {
          file: this.token.tokenizer.filename,
          line: this.token.line,
          column: this.token.column,
          expression: this.identifier
        };
      }
      return context.global[this.identifier] = 0 - value;
    } else {
      return scope[this.identifier] -= value;
    }
  };

  Variable.prototype.mul = function(context, value) {
    var id, scope;
    scope = this.getScope(context);
    if (scope == null) {
      id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
      if (!context.warnings.using_undefined_variable[id]) {
        context.warnings.using_undefined_variable[id] = {
          file: this.token.tokenizer.filename,
          line: this.token.line,
          column: this.token.column,
          expression: this.identifier
        };
      }
      return context.global[this.identifier] = 0;
    } else {
      return scope[this.identifier] *= value;
    }
  };

  Variable.prototype.div = function(context, value) {
    var id, scope;
    scope = this.getScope(context);
    if (scope == null) {
      id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
      if (!context.warnings.using_undefined_variable[id]) {
        context.warnings.using_undefined_variable[id] = {
          file: this.token.tokenizer.filename,
          line: this.token.line,
          column: this.token.column,
          expression: this.identifier
        };
      }
      return context.global[this.identifier] = 0;
    } else {
      return scope[this.identifier] /= value;
    }
  };

  Variable.prototype.toString = function() {
    return this.identifier;
  };

  return Variable;

})();

this.Program.Field = (function() {
  function Field(token1, expression1, chain) {
    this.token = token1;
    this.expression = expression1;
    this.chain = chain;
    this.token = this.expression.token;
  }

  Field.prototype.appendField = function(field) {
    return this.chain.push(field);
  };

  Field.prototype.assign = function(context, scope, value) {
    var c, i, id, j, len1, ref, v;
    if (this.expression.ensureCreated != null) {
      v = this.expression.ensureCreated(context);
    } else {
      v = this.expression.evaluate(context, true);
    }
    ref = this.chain;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      c = ref[i];
      c = c.evaluate(context, true) || 0;
      if ((v[c] == null) && i < this.chain.length - 1) {
        id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column + "-" + i;
        if (!context.warnings.assigning_field_to_undefined[id]) {
          context.warnings.assigning_field_to_undefined[id] = {
            file: this.token.tokenizer.filename,
            line: this.token.line,
            column: this.token.column,
            expression: this.token.tokenizer.input.substring(this.token.start, this.chain[i].token.start + this.chain[i].token.length)
          };
        }
        v[c] = {};
      }
      if (i === this.chain.length - 1) {
        v[c] = value;
      } else {
        v = v[c];
      }
    }
    return value;
  };

  Field.prototype.add = function(context, value) {
    var c, i, j, len1, ref, v, v2, val;
    if (this.expression.ensureCreated != null) {
      v = this.expression.ensureCreated(context);
    } else {
      v = this.expression.evaluate(context, true);
    }
    ref = this.chain;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      c = ref[i];
      c = c.evaluate(context, true) || 0;
      if (i < this.chain.length - 1) {
        v2 = v[c];
        if (!v2) {
          this.reportAssignWarning(context, i);
          v2 = v[c] = {};
        }
        v = v2;
      } else {
        val = v[c];
        if (val == null) {
          this.reportUndefinedWarning(context, i);
        }
        return v[c] = (val != null ? val : 0) + value;
      }
    }
    return v[c];
  };

  Field.prototype.sub = function(context, value) {
    var c, i, j, len1, ref, v, v2;
    if (this.expression.ensureCreated != null) {
      v = this.expression.ensureCreated(context);
    } else {
      v = this.expression.evaluate(context, true);
    }
    ref = this.chain;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      c = ref[i];
      c = c.evaluate(context, true) || 0;
      if (i < this.chain.length - 1) {
        v2 = v[c];
        if (!v2) {
          this.reportAssignWarning(context, i);
          v2 = v[c] = {};
        }
        v = v2;
      } else {
        if (v[c] == null) {
          this.reportUndefinedWarning(context, i);
        }
        return v[c] = (v[c] || 0) - value;
      }
    }
    return v[c];
  };

  Field.prototype.mul = function(context, value) {
    var c, i, j, len1, ref, v, v2;
    if (this.expression.ensureCreated != null) {
      v = this.expression.ensureCreated(context);
    } else {
      v = this.expression.evaluate(context, true);
    }
    ref = this.chain;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      c = ref[i];
      c = c.evaluate(context, true) || 0;
      if (i < this.chain.length - 1) {
        v2 = v[c];
        if (!v2) {
          this.reportAssignWarning(context, i);
          v2 = v[c] = {};
        }
        v = v2;
      } else {
        if (v[c] == null) {
          this.reportUndefinedWarning(context, i);
        }
        return v[c] = (v[c] || 0) * value;
      }
    }
    return v[c];
  };

  Field.prototype.div = function(context, value) {
    var c, i, j, len1, ref, v, v2;
    if (this.expression.ensureCreated != null) {
      v = this.expression.ensureCreated(context);
    } else {
      v = this.expression.evaluate(context, true);
    }
    ref = this.chain;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      c = ref[i];
      c = c.evaluate(context, true) || 0;
      if (i < this.chain.length - 1) {
        v2 = v[c];
        if (!v2) {
          this.reportAssignWarning(context, i);
          v2 = v[c] = {};
        }
        v = v2;
      } else {
        if (v[c] == null) {
          this.reportUndefinedWarning(context, i);
        }
        return v[c] = (v[c] || 0) / value;
      }
    }
    return v[c];
  };

  Field.prototype.reportAssignWarning = function(context, i) {
    var id;
    id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column + "-" + i;
    if (!context.warnings.assigning_field_to_undefined[id]) {
      return context.warnings.assigning_field_to_undefined[id] = {
        file: this.token.tokenizer.filename,
        line: this.token.line,
        column: this.token.column,
        expression: this.token.tokenizer.input.substring(this.token.start, this.chain[i].token.start + this.chain[i].token.length)
      };
    }
  };

  Field.prototype.reportUndefinedWarning = function(context, i) {
    var id;
    id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column + "-" + i;
    if (!context.warnings.using_undefined_variable[id]) {
      return context.warnings.using_undefined_variable[id] = {
        file: this.token.tokenizer.filename,
        line: this.token.line,
        column: this.token.column,
        expression: this.token.tokenizer.input.substring(this.token.start, this.chain[i].token.start + this.chain[i].token.length)
      };
    }
  };

  Field.prototype.evaluate = function(context) {
    var c, i, id, j, len1, p, ref, v;
    context.location = this;
    v = this.expression.evaluate(context);
    if (v == null) {
      return 0;
    } else {
      ref = this.chain;
      for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
        c = ref[i];
        p = this.parentObject = v;
        c = c.evaluate(context, true) || 0;
        v = v[c];
        while ((v == null) && (p["class"] != null)) {
          p = p["class"];
          v = p[c];
        }
        if (v == null) {
          id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
          if (!context.warnings.using_undefined_variable[id]) {
            context.warnings.using_undefined_variable[id] = {
              file: this.token.tokenizer.filename,
              line: this.token.line,
              column: this.token.column,
              expression: this.token.tokenizer.input.substring(this.token.start, this.chain[i].token.start + this.chain[i].token.length)
            };
          }
          return 0;
        }
      }
      this.childName = c;
      this.superClass = p["class"];
      return v;
    }
  };

  return Field;

})();

Program.BuildOperations = function(ops, terms) {
  var i, o, o1, o2, prec, t1, t2;
  while (ops.length > 1) {
    i = 0;
    prec = 0;
    while (i < ops.length - 1) {
      o1 = ops[i];
      o2 = ops[i + 1];
      if (Program.Precedence[o2.operation] <= Program.Precedence[o1.operation]) {
        break;
      }
      i++;
    }
    t1 = terms[i];
    t2 = terms[i + 1];
    o = new Program.Operation(ops[i].token, ops[i].operation, t1, t2);
    terms.splice(i, 2, o);
    ops.splice(i, 1);
  }
  return new Program.Operation(ops[0].token, ops[0].operation, terms[0], terms[1]);
};

this.Program.Operation = (function() {
  function Operation(token1, operation, term1, term2) {
    this.token = token1;
    this.operation = operation;
    this.term1 = term1;
    this.term2 = term2;
    this.f = Program.BinaryOps[this.operation];
  }

  Operation.prototype.evaluate = function(context, hold) {
    context.location = this;
    return this.f(context, this.term1, this.term2);
  };

  return Operation;

})();

this.Program.Negate = (function() {
  function Negate(token1, expression1) {
    this.token = token1;
    this.expression = expression1;
    this.optimize();
  }

  Negate.prototype.optimize = function() {
    var value;
    if (this.expression.optimize != null) {
      this.expression.optimize();
    }
    if (this.expression.constant != null) {
      value = this.expression.constant || 0;
      return this.evaluate = function() {
        return -value;
      };
    }
  };

  Negate.prototype.evaluate = function(context) {
    context.location = this;
    return -(this.expression.evaluate(context, true) || 0);
  };

  return Negate;

})();

this.Program.Not = (function() {
  function Not(token1, expression1) {
    this.token = token1;
    this.expression = expression1;
  }

  Not.prototype.evaluate = function(context) {
    context.location = this;
    if (this.expression.evaluate(context, true)) {
      return 0;
    } else {
      return 1;
    }
  };

  return Not;

})();

this.Program.Braced = (function() {
  function Braced(token1, expression1) {
    this.token = token1;
    this.expression = expression1;
  }

  Braced.prototype.evaluate = function(context, hold) {
    context.location = this;
    return this.expression.evaluate(context, hold);
  };

  return Braced;

})();

this.Program.SequenceEvaluator = function(context, sequence, local, hold) {
  var i, j, len1, local_save, res, s;
  if (local != null) {
    local_save = context.local;
    context.local = local;
  }
  res = 0;
  if (Date.now() > context.timeout) {
    throw "Timeout";
  }
  for (i = j = 0, len1 = sequence.length; j < len1; i = ++j) {
    s = sequence[i];
    res = s.evaluate(context, hold && i === sequence.length - 1);
    if (context["return"]) {
      break;
    }
    if ((context["break"] && context.breakable > 0) || (context["continue"] && context.continuable > 0)) {
      break;
    }
    if (Date.now() > context.timeout) {
      throw "Timeout";
    }
  }
  if (local != null) {
    context.local = local_save;
  }
  return res;
};

this.Program.Return = (function() {
  function Return(token1, expression1) {
    this.token = token1;
    this.expression = expression1;
    this.no_expression = true;
  }

  Return.prototype.evaluate = function(context) {
    var v;
    if (this.expression != null) {
      v = this.expression.evaluate(context, true);
    } else {
      v = 0;
    }
    context["return"] = true;
    return v;
  };

  return Return;

})();

this.Program.Condition = (function() {
  function Condition(token1, chain) {
    this.token = token1;
    this.chain = chain;
  }

  Condition.prototype.evaluate = function(context, hold) {
    var c, j, len1, ref;
    context.location = this;
    ref = this.chain;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      c = ref[j];
      if (c.condition.evaluate(context, hold)) {
        return Program.SequenceEvaluator(context, c.sequence, null, hold);
      } else if (c["else"] != null) {
        return Program.SequenceEvaluator(context, c["else"], null, hold);
      }
    }
    return 0;
  };

  return Condition;

})();

this.Program.For = (function() {
  function For(token1, iterator, range_from1, range_to1, range_by1, sequence1) {
    this.token = token1;
    this.iterator = iterator;
    this.range_from = range_from1;
    this.range_to = range_to1;
    this.range_by = range_by1;
    this.sequence = sequence1;
  }

  For.prototype.evaluate = function(context, hold) {
    var i, j, list, local, range_by, range_from, range_to, ref, ref1, ref2, res;
    context.location = this;
    context.breakable += 1;
    context.continuable += 1;
    res = 0;
    context.iterations = 0;
    if (hold) {
      list = [];
    }
    range_from = this.range_from.evaluate(context, true);
    range_to = this.range_to.evaluate(context, true);
    if (this.range_by === 0) {
      range_by = range_to > range_from ? 1 : -1;
    } else {
      range_by = this.range_by.evaluate(context, true);
    }
    local = context.local;
    for (i = j = ref = range_from, ref1 = range_to, ref2 = range_by; ref2 > 0 ? j <= ref1 : j >= ref1; i = j += ref2) {
      local[this.iterator] = i;
      res = Program.SequenceEvaluator(context, this.sequence, null, hold);
      if (hold) {
        list.push(res);
      }
      if (context["return"]) {
        list = res;
        break;
      }
      if (context["break"]) {
        context["break"] = false;
        break;
      } else if (context["continue"]) {
        context["continue"] = false;
      }
      context.iterations++;
    }
    context.breakable -= 1;
    context.continuable -= 1;
    if (hold) {
      return list;
    } else {
      return res;
    }
  };

  return For;

})();

this.Program.ForIn = (function() {
  function ForIn(token1, iterator, list1, sequence1) {
    this.token = token1;
    this.iterator = iterator;
    this.list = list1;
    this.sequence = sequence1;
  }

  ForIn.prototype.evaluate = function(context, hold) {
    var i, j, len, list, local, ref, res, source;
    context.location = this;
    context.breakable += 1;
    context.continuable += 1;
    res = 0;
    context.iterations = 0;
    if (hold) {
      list = [];
    }
    source = this.list.evaluate(context, true);
    local = context.local;
    if (Array.isArray(source)) {
      len = source.length;
      for (i = j = 0, ref = len - 1; j <= ref; i = j += 1) {
        local[this.iterator] = source[i];
        res = Program.SequenceEvaluator(context, this.sequence, null, hold);
        if (hold) {
          list.push(res);
        }
        if (context["return"]) {
          list = res;
          break;
        }
        if (context["break"]) {
          context["break"] = false;
          break;
        } else if (context["continue"]) {
          context["continue"] = false;
        }
        context.iterations++;
      }
    } else if (typeof source === "object") {
      for (i in source) {
        local[this.iterator] = i;
        res = Program.SequenceEvaluator(context, this.sequence, null, hold);
        if (hold) {
          list.push(res);
        }
        if (context["return"]) {
          list = res;
          break;
        }
        if (context["break"]) {
          context["break"] = false;
          break;
        } else if (context["continue"]) {
          context["continue"] = false;
        }
        context.iterations++;
      }
    } else {
      res = list = 0;
    }
    context.breakable -= 1;
    context.continuable -= 1;
    if (hold) {
      return list;
    } else {
      return res;
    }
  };

  return ForIn;

})();

Program.toString = function(value, nesting) {
  var i, j, k, key, len1, pref, ref, s, v;
  if (nesting == null) {
    nesting = 0;
  }
  if (value instanceof Program.Function) {
    if (nesting === 0) {
      return value.source;
    } else {
      return "[function]";
    }
  } else if (typeof value === "function") {
    return "[native function]";
  } else if (typeof value === "string") {
    return "\"" + value + "\"";
  } else if (Array.isArray(value)) {
    if (nesting >= 1) {
      return "[list]";
    }
    s = "[";
    for (i = j = 0, len1 = value.length; j < len1; i = ++j) {
      v = value[i];
      s += Program.toString(v, nesting + 1) + (i < value.length - 1 ? "," : "");
    }
    return s + "]";
  } else if (typeof value === "object") {
    if (nesting >= 1) {
      return "[object]";
    }
    s = "object\n";
    pref = "";
    for (i = k = 1, ref = nesting; k <= ref; i = k += 1) {
      pref += "  ";
    }
    for (key in value) {
      v = value[key];
      s += pref + ("  " + key + " = " + (Program.toString(v, nesting + 1)) + "\n");
    }
    return s + pref + "end";
  }
  return value || 0;
};

this.Program.While = (function() {
  function While(token1, condition, sequence1) {
    this.token = token1;
    this.condition = condition;
    this.sequence = sequence1;
  }

  While.prototype.evaluate = function(context, hold) {
    var list, res;
    context.location = this;
    context.breakable += 1;
    context.continuable += 1;
    res = 0;
    context.iterations = 0;
    if (hold) {
      list = [];
    }
    while (this.condition.evaluate(context, true)) {
      res = Program.SequenceEvaluator(context, this.sequence, null, hold);
      if (hold) {
        list.push(res);
      }
      if (context["return"]) {
        list = res;
        break;
      }
      if (context["break"]) {
        context["break"] = false;
        break;
      } else if (context["continue"]) {
        context["continue"] = false;
      }
      context.iterations++;
    }
    context.breakable -= 1;
    context.continuable -= 1;
    if (hold) {
      return list;
    } else {
      return res;
    }
  };

  return While;

})();

this.Program.Break = (function() {
  function Break(token1) {
    this.token = token1;
    this.no_expression = true;
  }

  Break.prototype.evaluate = function(context) {
    context.location = this;
    context["break"] = true;
    return 0;
  };

  return Break;

})();

this.Program.Continue = (function() {
  function Continue(token1) {
    this.token = token1;
    this.no_expression = true;
  }

  Continue.prototype.evaluate = function(context) {
    context.location = this;
    context["continue"] = true;
    return 0;
  };

  return Continue;

})();

this.Program.Function = (function() {
  function Function(token1, args, sequence1, end) {
    this.token = token1;
    this.args = args;
    this.sequence = sequence1;
    this.source = "function" + this.token.tokenizer.input.substring(this.token.index, end.index + 2);
  }

  Function.prototype.evaluate = function(context) {
    context.location = this;
    return this;
  };

  Function.prototype.call = function(context, argv, hold) {
    var a, i, j, len1, local, ref, res;
    local = {};
    ref = this.args;
    for (i = j = 0, len1 = ref.length; j < len1; i = ++j) {
      a = ref[i];
      local[a.name] = argv[i] != null ? argv[i] : (a["default"] != null ? a["default"].evaluate(context, true) : 0);
    }
    context.stack_size += 1;
    if (context.stack_size > 100) {
      throw "Stack overflow";
    }
    res = Program.SequenceEvaluator(context, this.sequence, local, hold);
    context.stack_size -= 1;
    context["return"] = false;
    return res;
  };

  return Function;

})();

this.Program.FunctionCall = (function() {
  function FunctionCall(token1, expression1, args) {
    this.token = token1;
    this.expression = expression1;
    this.args = args;
  }

  FunctionCall.prototype.evaluate = function(context, hold) {
    var a, argv, child, convertArg, f, id, j, k, len1, len2, object, ref, ref1, res, superClass;
    context.location = this;
    f = this.expression.evaluate(context, true);
    if (f != null) {
      if (typeof f === "function") {
        convertArg = (function(_this) {
          return function(arg) {
            var funk;
            if ((arg != null) && arg instanceof Program.Function) {
              return funk = function() {
                return arg.call(context, arguments, true);
              };
            } else {
              return arg;
            }
          };
        })(this);
        switch (this.args.length) {
          case 0:
            res = f.call(this.expression.parentObject);
            break;
          case 1:
            res = f.call(this.expression.parentObject, convertArg(this.args[0].evaluate(context, true)));
            break;
          default:
            argv = [];
            ref = this.args;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              a = ref[j];
              argv.push(convertArg(a.evaluate(context, true)));
            }
            res = f.apply(this.expression.parentObject, argv);
        }
        if (res !== null) {
          return res;
        } else {
          return 0;
        }
      } else if (f instanceof Program.Function) {
        argv = [];
        ref1 = this.args;
        for (k = 0, len2 = ref1.length; k < len2; k++) {
          a = ref1[k];
          argv.push(a.evaluate(context, true));
        }
        object = context.object;
        child = context.childName;
        superClass = context.superClass;
        if (this.expression.parentObject != null) {
          context.object = this.expression.parentObject;
          context.childName = this.expression.childName;
          context.superClass = this.expression.superClass;
        } else if (this.expression.scope === object) {
          context.object = object;
        } else {
          context.object = context.global;
        }
        res = f.call(context, argv, hold) || 0;
        context.object = object;
        context.childName = child;
        context.superClass = superClass;
        return res;
      } else {
        id = this.token.tokenizer.filename + "-" + this.token.line + "-" + this.token.column;
        if (!context.warnings.invoking_non_function[id]) {
          context.warnings.invoking_non_function[id] = {
            file: this.token.tokenizer.filename,
            line: this.token.line,
            column: this.token.column,
            expression: this.token.tokenizer.input.substring(this.expression.token.start, this.token.start - 1)
          };
        }
        return f;
      }
    }
  };

  return FunctionCall;

})();

this.Program.CreateObject = (function() {
  function CreateObject(token1, fields) {
    this.token = token1;
    this.fields = fields;
  }

  CreateObject.prototype.evaluate = function(context) {
    var f, j, len1, ref, res;
    res = {};
    ref = this.fields;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      f = ref[j];
      res[f.field] = f.value.evaluate(context, true);
    }
    return res;
  };

  return CreateObject;

})();

this.Program.CreateClass = (function() {
  function CreateClass(token1, ext, fields) {
    this.token = token1;
    this.ext = ext;
    this.fields = fields;
  }

  CreateClass.prototype.evaluate = function(context) {
    var e, f, j, len1, ref, res;
    res = {};
    ref = this.fields;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      f = ref[j];
      res[f.field] = f.value.evaluate(context, true);
    }
    if (this.ext != null) {
      if (this.ext instanceof Program.Variable) {
        e = this.ext.evaluate(context, true, false);
        res["class"] = e ? e : this.ext.identifier;
      } else {
        res["class"] = this.ext.evaluate(context, true);
      }
    }
    return res;
  };

  return CreateClass;

})();

this.Program.resolveParentClass = function(obj, context, token) {
  var id;
  if ((obj["class"] != null) && typeof obj["class"] === "string") {
    if (context.global[obj["class"]] != null) {
      obj["class"] = context.global[obj["class"]];
    } else {
      id = "classname-" + obj["class"];
      if (!context.warnings.using_undefined_variable[id]) {
        context.warnings.using_undefined_variable[id] = {
          file: token.tokenizer.filename,
          line: token.line,
          column: token.column,
          expression: obj["class"]
        };
      }
    }
  }
  if (obj["class"] != null) {
    return Program.resolveParentClass(obj["class"], context, token);
  }
};

this.Program.NewCall = (function() {
  function NewCall(token1, expression1) {
    this.token = token1;
    this.expression = expression1;
    if (!(this.expression instanceof Program.FunctionCall)) {
      this.expression = new Program.FunctionCall(this.token, this.expression, []);
    }
  }

  NewCall.prototype.evaluate = function(context) {
    var a, argv, c, child, f, fc, j, k, len1, len2, object, ref, ref1, res, superClass, v;
    res = {};
    if (this.expression instanceof Program.FunctionCall) {
      context.location = this;
      fc = this.expression;
      f = fc.expression.evaluate(context, true);
      if (f != null) {
        if (typeof f === "function") {
          switch (this.expression.args.length) {
            case 0:
              return new f();
            case 1:
              v = this.expression.args[0].evaluate(context, true);
              return new f(v != null ? v : 0);
            default:
              argv = [];
              ref = this.expression.args;
              for (j = 0, len1 = ref.length; j < len1; j++) {
                a = ref[j];
                v = a.evaluate(context, true);
                argv.push(v != null ? v : 0);
              }
              return (function(func, args, ctor) {
                ctor.prototype = func.prototype;
                var child = new ctor, result = func.apply(child, args);
                return Object(result) === result ? result : child;
              })(f, argv, function(){});
          }
        } else {
          res["class"] = f;
          Program.resolveParentClass(res, context, this.token);
          argv = [];
          ref1 = fc.args;
          for (k = 0, len2 = ref1.length; k < len2; k++) {
            a = ref1[k];
            argv.push(a.evaluate(context, true));
          }
          object = context.object;
          child = context.childName;
          superClass = context.superClass;
          context.object = res;
          context.childName = "constructor";
          c = f.constructor;
          while ((c == null) && (f.data != null)) {
            f = f.data;
            c = f.constructor;
          }
          context.superClass = f["class"];
          if (c != null) {
            if (c instanceof Program.Function) {
              c.call(context, argv, false);
            } else if (typeof c === "function") {
              c.apply(res, argv);
            }
          }
          context.object = object;
          context.childName = child;
          context.superClass = superClass;
        }
      }
    } else {
      c = this.expression.evaluate(context, true);
      res["class"] = c;
    }
    return res;
  };

  return NewCall;

})();

this.Program.BinaryOps = {
  "+": function(context, a, b) {
    var key, res, value;
    a = a.evaluate(context, true);
    b = b.evaluate(context, true);
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.concat(b);
    } else if (typeof a === "object" && typeof b === "object") {
      res = {};
      for (key in b) {
        value = b[key];
        res[key] = value;
      }
      for (key in a) {
        value = a[key];
        res[key] = value;
      }
      return res;
    }
    return (a + b) || 0;
  },
  "*": function(context, a, b) {
    return (a.evaluate(context, true) * b.evaluate(context, true)) || 0;
  },
  "-": function(context, a, b) {
    return (a.evaluate(context, true) - b.evaluate(context, true)) || 0;
  },
  "/": function(context, a, b) {
    return (a.evaluate(context, true) / b.evaluate(context, true)) || 0;
  },
  "%": function(context, a, b) {
    return (a.evaluate(context, true) % b.evaluate(context, true)) || 0;
  },
  "^": function(context, a, b) {
    return (Math.pow(a.evaluate(context, true), b.evaluate(context, true))) || 0;
  },
  "and": function(context, a, b) {
    if (a.evaluate(context, true)) {
      if (b.evaluate(context, true)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },
  "or": function(context, a, b) {
    if (a.evaluate(context, true)) {
      return 1;
    } else {
      if (b.evaluate(context, true)) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  "==": function(context, a, b) {
    if (a.evaluate(context,true) == b.evaluate(context,true)) {
      return 1;
    } else {
      return 0;
    }
  },
  "!=": function(context, a, b) {
    if (a.evaluate(context,true) != b.evaluate(context,true)) {
      return 1;
    } else {
      return 0;
    }
  },
  "<": function(context, a, b) {
    if (a.evaluate(context, true) < b.evaluate(context, true)) {
      return 1;
    } else {
      return 0;
    }
  },
  ">": function(context, a, b) {
    if (a.evaluate(context, true) > b.evaluate(context, true)) {
      return 1;
    } else {
      return 0;
    }
  },
  "<=": function(context, a, b) {
    if (a.evaluate(context, true) <= b.evaluate(context, true)) {
      return 1;
    } else {
      return 0;
    }
  },
  ">=": function(context, a, b) {
    if (a.evaluate(context, true) >= b.evaluate(context, true)) {
      return 1;
    } else {
      return 0;
    }
  }
};

this.Program.Precedence = {
  "^": 21,
  "/": 20,
  "*": 19,
  "%": 18,
  "+": 17,
  "-": 17,
  "<": 16,
  "<=": 15,
  ">": 14,
  ">=": 13,
  "==": 12,
  "!=": 11,
  "and": 10,
  "or": 9
};

var JSTranspiler;

JSTranspiler = (function() {
  function JSTranspiler(program, strict) {
    var context, i, indent, j, k, l, len, len1, line, m, ref, ref1, ref2, s;
    this.program = program;
    this.strict = strict != null ? strict : false;
    this.code_saves = [];
    this.code = "var _msResolveVariable = function(v) {\n  let res = context.meta[v] ;\n  if (res == null) {\n    res = context.object[v] ;\n    if (res == null) {\n      res = context.global[v] ;\n    }\n  }\n  return res == null? 0 : res ;\n};\n\nvar _msResolveField = function(v,f) {\n  var res = v[f];\n  while (res == null && v[\"class\"] != null) {\n    v = v[\"class\"] ;\n    res = v[f] ;\n  }\n  return res!=null? res: 0 ;\n} ;\n\nvar _msResolveParentClass = function(obj) {\n  if (obj.class != null && typeof obj.class == \"string\") {\n    if (context.global[obj.class] != null) {\n      obj.class = context.global[obj.class] ;\n    }\n    _msResolveParentClass(obj.class);\n  }\n  else if (obj.class != null) {\n    _msResolveParentClass(obj.class);\n  }\n} ;\n\nvar _msApply = function(parent,field, ...args) {\n  let save = context.object ;\n  let currentClass = context.currentClass ;\n  let childName = context.childName ;\n\n  context.object = parent ;\n  context.currentClass = parent ;\n  context.childName = field ;\n\n  let c = parent ;\n  let f = c[field] ;\n  while (f == null && c[\"class\"] != null) {\n    c = c[\"class\"] ;\n    f = c[field] ;\n    context.currentClass = c ;\n  }\n\n  let res = 0 ;\n  if (f != null) {\n    if (typeof f == \"function\") {\n      res = f.apply(parent,args) ;\n    }\n    else {\n      res = f ;\n    }\n  }\n\n  context.object = save ;\n  context.currentClass = currentClass ;\n  context.childName = childName ;\n\n  if (res != null) {\n    return res ;\n  }\n  else {\n    return 0 ;\n  }\n};\n\nvar _msInvoke = function(field, ...args) {\n  let f = null ;\n  let res = 0 ;\n\n  if (context.meta.hasOwnProperty(field)) {\n    f = context.meta[field] ;\n    res = f.apply(null,args) ;\n  }\n  else {\n    let currentClass = context.currentClass ;\n    let childName = context.childName ;\n\n    if (field == \"super\") {\n      let c = currentClass ;\n      f = null ;\n      while (f == null && c[\"class\"] != null) {\n        c = c[\"class\"] ;\n        f = c[childName] ;\n        context.currentClass = c ;\n      }\n    }\n    else {\n      context.currentClass = context.object ;\n      context.childName = field ;\n      let c = context.object ;\n      f = c[field] ;\n      while (f == null && c[\"class\"] != null) {\n        c = c[\"class\"] ;\n        f = c[field] ;\n        context.currentClass = c ;\n      }\n    }\n\n    if (f != null) {\n      if (typeof f == \"function\") {\n        res = f.apply(context.object,args) ;\n      }\n      else {\n        res = f ;\n      }\n    }\n    else if (context.global[field] != null) {\n      f = context.global[field] ;\n      let save = context.object ;\n      context.object = context.global ;\n      if (typeof f == \"function\") {\n        res = f.apply(context.object,args) ;\n      }\n      else {\n        res = f ;\n      }\n      context.object = save ;\n    }\n\n    context.currentClass = currentClass ;\n    context.childName = childName ;\n  }\n\n  if (res != null) {\n    return res ;\n  }\n  else {\n    return 0 ;\n  }\n};\n";
    this.code = [this.code];
    context = {
      local_variables: {},
      temp_variable_count: 0,
      tmpcount: 0
    };
    ref = this.program.statements;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      s = ref[i];
      if (i === this.program.statements.length - 1) {
        this.code.push("return " + (this.transpile(s, context, true)) + " ;");
      } else {
        this.code.push(this.transpile(s, context, false) + " ;");
      }
    }
    this.code = this.code.join("\n");
    this.code = this.code.split("\n");
    indent = 0;
    ref1 = this.code;
    for (l = k = 0, len1 = ref1.length; k < len1; l = ++k) {
      line = ref1[l];
      indent -= (line.match(/}/g) || []).length;
      for (i = m = 0, ref2 = indent - 1; m <= ref2; i = m += 1) {
        this.code[l] = "  " + this.code[l];
      }
      indent += (line.match(/{/g) || []).length;
    }
    this.code = this.code.join("\n");
    console.info(this.code);
  }

  JSTranspiler.prototype.transpile = function(statement, context, retain) {
    if (statement instanceof Program.Assignment) {
      return this.transpileAssignment(statement, context, retain);
    }
    if (statement instanceof Program.SelfAssignment) {
      return this.transpileSelfAssignment(statement, context, retain);
    } else if (statement instanceof Program.Operation) {
      return this.transpileOperation(statement, context);
    } else if (statement instanceof Program.Braced) {
      return this.transpileBraced(statement, context, retain);
    } else if (statement instanceof Program.Negate) {
      return this.transpileNegate(statement, context, retain);
    } else if (statement instanceof Program.Not) {
      return this.transpileNot(statement, context, retain);
    } else if (statement instanceof Program.Value) {
      return this.transpileValue(statement, context);
    } else if (statement instanceof Program.Variable) {
      return this.transpileVariable(statement, context);
    } else if (statement instanceof Program.Field) {
      return this.transpileField(statement, context);
    } else if (statement instanceof Program.FunctionCall) {
      return this.transpileFunctionCall(statement, context, retain);
    } else if (statement instanceof Program.For) {
      return this.transpileFor(statement, context, retain);
    } else if (statement instanceof Program.ForIn) {
      return this.transpileForIn(statement, context, retain);
    } else if (statement instanceof Program.While) {
      return this.transpileWhile(statement, context, retain);
    } else if (statement instanceof Program.Break) {
      return this.transpileBreak(statement, context);
    } else if (statement instanceof Program.Continue) {
      return this.transpileContinue(statement, context);
    } else if (statement instanceof Program.Function) {
      return this.transpileFunction(statement, context);
    } else if (statement instanceof Program.Return) {
      return this.transpileReturn(statement, context);
    } else if (statement instanceof Program.Condition) {
      return this.transpileCondition(statement, context, retain);
    } else if (statement instanceof Program.CreateObject) {
      return this.transpileCreateObject(statement, context);
    } else if (statement instanceof Program.CreateClass) {
      return this.transpileCreateClass(statement, context);
    } else if (statement instanceof Program.NewCall) {
      return this.transpileNewCall(statement, context);
    }
  };

  JSTranspiler.prototype.transpileAssignment = function(statement, context, retain) {
    var chain, f, i, j, recipient, ref, v;
    if (statement.local) {
      if (statement.field instanceof Program.Variable) {
        context.local_variables[statement.field.identifier] = true;
        if (retain) {
          this.prepend("var " + statement.field.identifier + " = " + (this.transpile(statement.expression, context, true)) + " ;\n");
          return statement.field.identifier;
        } else {
          return "var " + statement.field.identifier + " = " + (this.transpile(statement.expression, context, true)) + " ;\n";
        }
      } else {
        throw "illegal";
      }
    } else {
      if (statement.field instanceof Program.Variable) {
        if (context.local_variables[statement.field.identifier]) {
          return statement.field.identifier + " = " + (this.transpile(statement.expression, context, true)) + (retain ? "" : ";");
        } else if (statement.expression instanceof Program.CreateClass) {
          return "context.object[\"" + statement.field.identifier + "\"] = " + (this.transpileUpdateClass(statement.expression, context, statement.field.identifier));
        } else {
          return "context.object[\"" + statement.field.identifier + "\"] = " + (this.transpile(statement.expression, context, true));
        }
      } else {
        f = statement.field;
        if (f.expression instanceof Program.Variable) {
          if (f.expression.identifier === "this") {
            recipient = "context.object";
          } else if (context.local_variables[f.expression.identifier]) {
            this.code.push("if (" + f.expression.identifier + " == null) {" + f.expression.identifier + " = {};}");
            recipient = f.expression.identifier;
          } else if (f.expression.identifier === "global") {
            recipient = "context.global";
          } else {
            recipient = this.createTempVariable(context);
            this.prepend("var " + recipient + " = context.object[\"" + f.expression.identifier + "\"] ;");
            this.prepend("if (" + recipient + " == null) " + recipient + " = context.global[\"" + f.expression.identifier + "\"] ;");
            this.prepend("if (" + recipient + " == null) " + recipient + " = context.object[\"" + f.expression.identifier + "\"] = {} ;");
          }
        } else {
          recipient = this.createTempVariable(context);
          this.prepend("var " + recipient + " = " + (this.transpile(f.expression, context, true)) + " ;");
        }
        chain = recipient;
        for (i = j = 0, ref = f.chain.length - 2; j <= ref; i = j += 1) {
          v = this.evaluated(f.chain[i], context);
          chain += "[" + v + "]";
          this.code.push("if (" + chain + " == null) {" + chain + " = {} ;}");
        }
        return chain + "[" + (this.transpile(f.chain[f.chain.length - 1], context, true)) + "] = " + (this.transpile(statement.expression, context, true));
      }
    }
  };

  JSTranspiler.prototype.transpileSelfAssignment = function(statement, context, retain) {
    var chain, f, i, j, op, recipient, ref, v;
    switch (statement.operation) {
      case Token.TYPE_PLUS_EQUALS:
        op = "+";
        break;
      case Token.TYPE_MINUS_EQUALS:
        op = "-";
        break;
      case Token.TYPE_MULTIPLY_EQUALS:
        op = "*";
        break;
      case Token.TYPE_DIVIDE_EQUALS:
        op = "/";
    }
    if (statement.field instanceof Program.Variable) {
      if (context.local_variables[statement.field.identifier]) {
        return statement.field.identifier + " " + op + "= " + (this.transpile(statement.expression, context, true));
      } else {
        v = this.createTempVariable(context);
        this.prepend("var " + v + " = context.object[\"" + statement.field.identifier + "\"] ;");
        return "context.object[\"" + statement.field.identifier + "\"] = (" + v + " != null ? " + v + " : 0) " + op + " " + (this.transpile(statement.expression, context, true));
      }
    } else {
      f = statement.field;
      if (f.expression instanceof Program.Variable) {
        if (f.expression.identifier === "this") {
          recipient = "context.object";
        } else if (context.local_variables[f.expression.identifier]) {
          this.code.push("if (" + f.expression.identifier + " == null) {" + f.expression.identifier + " = {};}");
          recipient = f.expression.identifier;
        } else {
          this.code.push("if (context.object[\"" + f.expression.identifier + "\"] == null) {context.object[\"" + f.expression.identifier + "\"] = {};}");
          recipient = "context.object[\"" + f.expression.identifier + "\"]";
        }
      } else {
        recipient = this.evaluated(f.expression, context);
      }
      chain = recipient;
      if (f.chain.length > 1) {
        for (i = j = 0, ref = f.chain.length - 2; j <= ref; i = j += 1) {
          v = this.evaluated(f.chain[i], context);
          chain += "[" + v + "]";
          this.code.push("if (" + chain + " == null) {" + chain + " = {} ;}");
        }
      }
      v = this.evaluated(f.chain[f.chain.length - 1], context);
      return chain + "[" + v + "] = (" + chain + "[" + v + "] != null ? " + chain + "[" + v + "] : 0) " + op + " " + (this.transpile(statement.expression, context, true));
    }
  };

  JSTranspiler.prototype.transpileOperation = function(op, context) {
    var ref, ref1, ref2;
    if ((ref = op.operation) === "+") {
      return this.transpile(op.term1, context, true) + op.operation + this.transpile(op.term2, context, true);
    } else if ((ref1 = op.operation) === "-" || ref1 === "*" || ref1 === "/" || ref1 === "%") {
      return "((" + (this.transpile(op.term1, context, true)) + " " + op.operation + " " + (this.transpile(op.term2, context, true)) + ")||0)";
    } else if ((ref2 = op.operation) === "==" || ref2 === "!=" || ref2 === "<" || ref2 === ">" || ref2 === "<=" || ref2 === ">=") {
      return "((" + (this.transpile(op.term1, context, true)) + " " + op.operation + " " + (this.transpile(op.term2, context, true)) + ")? 1 : 0)";
    } else if (op.operation === "and") {
      return "((" + (this.transpile(op.term1, context, true)) + " && " + (this.transpile(op.term2, context, true)) + ")? 1 : 0)";
    } else if (op.operation === "or") {
      return "((" + (this.transpile(op.term1, context, true)) + " || " + (this.transpile(op.term2, context, true)) + ")? 1 : 0)";
    } else if (op.operation === "^") {
      return "Math.pow(" + (this.transpile(op.term1, context, true)) + "," + (this.transpile(op.term2, context, true)) + ")";
    } else {
      return "";
    }
  };

  JSTranspiler.prototype.transpileBraced = function(expression, context, retain) {
    return "(" + (this.transpile(expression.expression, context, retain)) + ")";
  };

  JSTranspiler.prototype.transpileNegate = function(expression, context, retain) {
    return "- " + (this.transpile(expression.expression, context, retain));
  };

  JSTranspiler.prototype.transpileNot = function(expression, context, retain) {
    return "((" + (this.transpile(expression.expression, context, retain)) + ")? 0 : 1)";
  };

  JSTranspiler.prototype.evaluated = function(expression, context) {
    var v;
    if (expression instanceof Program.Value) {
      if (expression.type === Program.Value.TYPE_NUMBER) {
        return "" + expression.value;
      } else if (expression.type === Program.Value.TYPE_STRING) {
        return "\"" + (expression.value.replace(/"/g, '\\\"')) + "\"";
      }
    } else if (expression instanceof Program.Variable) {
      if (context.local_variables[expression.identifier]) {
        return expression.identifier;
      }
    }
    v = this.createTempVariable(context);
    this.prepend("var " + v + " = " + (this.transpile(expression, context, true)) + " ;");
    return v;
  };

  JSTranspiler.prototype.transpileValue = function(value, context) {
    var e, i, j, len, ref, res;
    switch (value.type) {
      case Program.Value.TYPE_NUMBER:
        return "" + value.value;
      case Program.Value.TYPE_STRING:
        return "\"" + (value.value.replace(/"/g, '\\\"')) + "\"";
      case Program.Value.TYPE_ARRAY:
        res = "[";
        ref = value.value;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          e = ref[i];
          if (i !== 0) {
            res += ", ";
          }
          res += this.transpile(e, context, true);
        }
        res += "]";
        return res;
    }
  };

  JSTranspiler.prototype.transpileVariable = function(variable, context) {
    var v;
    v = variable.identifier;
    if (v === "this") {
      return "context.object";
    } else if (context.local_variables[v]) {
      return "" + v;
    } else {
      return "_msResolveVariable(\"" + v + "\")";
    }
  };

  JSTranspiler.prototype.transpileField = function(field, context) {
    var c, j, len, ref, res;
    if (field.expression instanceof Program.Variable && field.expression.identifier === "this") {
      res = "context.object";
    } else {
      res = this.transpile(field.expression, context, true);
    }
    ref = field.chain;
    for (j = 0, len = ref.length; j < len; j++) {
      c = ref[j];
      res = "_msResolveField(" + res + "," + (this.transpile(c, context, true)) + ")";
    }
    return res;
  };

  JSTranspiler.prototype.transpileFieldParent = function(field, context) {
    var c, i, j, ref, res;
    res = this.transpile(field.expression, context, true);
    for (i = j = 0, ref = field.chain.length - 2; j <= ref; i = j += 1) {
      c = field.chain[i];
      res = "_msResolveField(" + res + "," + (this.transpile(c, context, true)) + ")";
    }
    return res;
  };

  JSTranspiler.prototype.transpileFunctionCall = function(call, context) {
    var a, args, field, i, j, k, len, len1, len2, len3, len4, m, n, o, parent, ref, ref1, ref2, ref3, ref4, res, v;
    if (call.expression instanceof Program.Field) {
      parent = this.transpileFieldParent(call.expression, context);
      field = this.transpile(call.expression.chain[call.expression.chain.length - 1], context, true);
      res = "_msApply(" + parent + "," + field;
      ref = call.args;
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        a = ref[i];
        res += ", ";
        res += this.transpile(a, context, true);
      }
      res += ")";
      return res;
    } else if (call.expression instanceof Program.Variable) {
      if (JSTranspiler.predefined_functions[call.expression.identifier] != null) {
        res = JSTranspiler.predefined_functions[call.expression.identifier];
        res += "(";
        ref1 = call.args;
        for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
          a = ref1[i];
          if (i > 0) {
            res += ", ";
          }
          res += this.transpile(a, context, true);
        }
        res += ")";
        return res;
      } else if (context.local_variables[call.expression.identifier] != null) {
        v = call.expression.identifier;
        args = "";
        ref2 = call.args;
        for (i = m = 0, len2 = ref2.length; m < len2; i = ++m) {
          a = ref2[i];
          if (i > 0) {
            args += ", ";
          }
          args += this.transpile(a, context, true);
        }
        return res = "((typeof " + v + " == \"function\")? (" + v + "(" + args + ")) : " + v + ")";
      } else {
        res = "_msInvoke(\"" + call.expression.identifier + "\" ";
        ref3 = call.args;
        for (i = n = 0, len3 = ref3.length; n < len3; i = ++n) {
          a = ref3[i];
          res += ", ";
          res += this.transpile(a, context, true);
        }
        res += ")";
        return res;
      }
    } else {
      res = this.transpile(call.expression, context, true);
      res += "(";
      ref4 = call.args;
      for (i = o = 0, len4 = ref4.length; o < len4; i = ++o) {
        a = ref4[i];
        if (i > 0) {
          res += ", ";
        }
        res += this.transpile(a, context, true);
      }
      res += ")";
      return res;
    }
  };

  JSTranspiler.prototype.transpileSequence = function(sequence, context, retain) {
    var i, j, len, res, s;
    for (i = j = 0, len = sequence.length; j < len; i = ++j) {
      s = sequence[i];
      res = this.transpile(s, context, (i === sequence.length - 1) && retain);
      if (i < sequence.length - 1) {
        this.prepend(res + " ;");
      } else if (s.no_expression) {
        this.prepend(res + " ;");
        res = "0";
      }
    }
    return res;
  };

  JSTranspiler.prototype.transpileFor = function(forloop, context, retain) {
    var range_by, range_from, range_to, res, save_breakable, save_continuable, timeout_count;
    range_from = this.createTempVariable(context);
    range_to = this.createTempVariable(context);
    range_by = this.createTempVariable(context);
    timeout_count = this.createTempVariable(context);
    this.code.push("var " + range_from + " = " + (this.transpile(forloop.range_from, context, true)) + " ;");
    this.code.push("var " + range_to + " = " + (this.transpile(forloop.range_to, context, true)) + " ;");
    this.code.push("var " + timeout_count + " = 0 ;");
    if (forloop.range_by !== 0) {
      this.code.push("var " + range_by + " = " + (this.transpile(forloop.range_by, context, true)) + " ;");
    } else {
      this.code.push("var " + range_by + " = " + range_from + "<" + range_to + " ? 1 : -1 ;");
    }
    context.local_variables[forloop.iterator] = true;
    this.prepend("for (var " + forloop.iterator + "=" + range_from + " ; " + range_by + ">0?" + forloop.iterator + "<=" + range_to + ":" + forloop.iterator + ">=" + range_to + " ; " + forloop.iterator + "+=" + range_by + ") {\n");
    save_breakable = context.breakable;
    save_continuable = context.continuable;
    context.breakable = true;
    context.continuable = true;
    this.openBlock();
    this.prepend("\nif (" + timeout_count + "++>1000) {\n  " + timeout_count + " = 0 ;\n  if (Date.now()>context.timeout) {\n    context.location = {\n      token: {\n        line: " + forloop.token.line + ",\n        column: " + forloop.token.column + "\n      }\n    }\n    throw('Timeout');\n  }\n}");
    res = this.transpileSequence(forloop.sequence, context);
    res += "\n}";
    this.code.push(res);
    this.closeBlock();
    context.breakable = save_breakable;
    context.continuable = save_continuable;
    return "0";
  };

  JSTranspiler.prototype.transpileForIn = function(forloop, context, retain) {
    var iter, length, list, res, save_breakable, save_continuable, source, timeout_count;
    source = this.createTempVariable(context);
    list = this.createTempVariable(context);
    length = this.createTempVariable(context);
    timeout_count = this.createTempVariable(context);
    iter = this.createTempVariable(context);
    this.prepend("var " + source + " = " + (this.transpile(forloop.list, context, true)) + " ; ");
    this.prepend("var " + list + " = Array.isArray(" + source + ") ? " + source + " : Object.keys(" + source + ") ;");
    this.prepend("var " + length + " = " + list + ".length ;");
    this.prepend("var " + timeout_count + " = 0 ;");
    this.prepend("var " + forloop.iterator + " ;");
    context.local_variables[forloop.iterator] = true;
    this.prepend("for (var " + iter + " = 0 ; " + iter + "<" + length + " ; " + iter + "++ ) {\n");
    this.prepend(forloop.iterator + " = " + list + "[" + iter + "] ;");
    save_breakable = context.breakable;
    save_continuable = context.continuable;
    context.breakable = true;
    context.continuable = true;
    this.openBlock();
    this.prepend("\nif (" + timeout_count + "++>1000) {\n  " + timeout_count + " = 0 ;\n  if (Date.now()>context.timeout) {\n    context.location = {\n      token: {\n        line: " + forloop.token.line + ",\n        column: " + forloop.token.column + "\n      }\n    }\n    throw('Timeout');\n  }\n}");
    this.prepend("if (" + forloop.iterator + " == null) { continue ; }");
    res = this.transpileSequence(forloop.sequence, context);
    res += "\n}";
    this.code.push(res);
    this.closeBlock();
    context.breakable = save_breakable;
    context.continuable = save_continuable;
    return "0";
  };

  JSTranspiler.prototype.transpileWhile = function(whiloop, context, retain) {
    var res, save_breakable, save_continuable, timeout_count;
    timeout_count = this.createTempVariable(context);
    this.code.push("var " + timeout_count + " = 0 ;");
    this.prepend("while (true) {\n");
    this.prepend("  if (! (" + (this.transpile(whiloop.condition, context, true)) + ")) { break ; }\n");
    save_breakable = context.breakable;
    save_continuable = context.continuable;
    context.breakable = true;
    context.continuable = true;
    this.openBlock();
    this.prepend("\nif (" + timeout_count + "++>1000) {\n  " + timeout_count + " = 0 ;\n  if (Date.now()>context.timeout) {\n    context.location = {\n      token: {\n        line: " + whiloop.token.line + ",\n        column: " + whiloop.token.column + "\n      }\n    }\n    throw('Timeout');\n  }\n}");
    res = this.transpileSequence(whiloop.sequence, context);
    res += "\n}";
    this.code.push(res);
    this.closeBlock();
    context.breakable = save_breakable;
    context.continuable = save_continuable;
    return "0";
  };

  JSTranspiler.prototype.transpileBreak = function(statement, context) {
    if (context.breakable) {
      return "break";
    } else {
      return "";
    }
  };

  JSTranspiler.prototype.transpileContinue = function(statement, context) {
    if (context.continuable) {
      return "continue";
    } else {
      return "";
    }
  };

  JSTranspiler.prototype.transpileFunction = function(func, context) {
    var a, i, j, k, len, len1, ref, ref1, res, save, seq;
    save = context.local_variables;
    context.local_variables = {};
    this.openBlock();
    res = "function(";
    ref = func.args;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      a = ref[i];
      if (i > 0) {
        res += ", ";
      }
      res += a.name;
      context.local_variables[a.name] = true;
    }
    res += ") {";
    this.prepend(res);
    ref1 = func.args;
    for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
      a = ref1[i];
      if (a["default"] != null) {
        this.prepend("if (" + a.name + " == null) " + a.name + " = " + (this.transpile(a["default"])) + " ;");
      } else {
        this.prepend("if (" + a.name + " == null) " + a.name + " = 0 ;");
      }
    }
    seq = func.sequence;
    if (seq.length > 0) {
      res = this.transpileSequence(seq, context, true);
      if (!(seq[func.sequence.length - 1] instanceof Program.Return)) {
        this.prepend("return " + res + " ;");
      } else {
        this.prepend(res);
      }
    }
    this.prepend("}");
    context.local_variables = save;
    return this.closeBlockNoPush();
  };

  JSTranspiler.prototype.transpileReturn = function(ret, context) {
    if (ret.expression != null) {
      return "return " + (this.transpile(ret.expression, context, true)) + " ;";
    } else {
      return "return ;";
    }
  };

  JSTranspiler.prototype.prepend = function(line) {
    return this.code.push(line);
  };

  JSTranspiler.prototype.openBlock = function() {
    this.code_saves.push(this.code);
    return this.code = [];
  };

  JSTranspiler.prototype.closeBlock = function() {
    var append;
    append = this.code.join("\n");
    this.code = this.code_saves.splice(this.code_saves.length - 1, 1)[0];
    return this.code.push(append);
  };

  JSTranspiler.prototype.closeBlockNoPush = function() {
    var append;
    append = this.code.join("\n");
    this.code = this.code_saves.splice(this.code_saves.length - 1, 1)[0];
    return append;
  };

  JSTranspiler.prototype.createTempVariable = function(context) {
    return "__temp_" + context.temp_variable_count++;
  };

  JSTranspiler.prototype.transpileConditionCase = function(chain, index, context, temp) {
    var c, res;
    c = chain[index];
    this.prepend("if (" + (this.transpile(c.condition, context, true)) + ") {");
    this.openBlock();
    res = this.transpileSequence(c.sequence, context, temp != null);
    this.closeBlock();
    if (temp != null) {
      this.prepend(temp + " = " + res + " ;");
    } else {
      this.prepend(res + " ;");
    }
    this.prepend("}");
    if (index < chain.length - 1) {
      this.prepend("else {");
      this.openBlock();
      this.transpileConditionCase(chain, index + 1, context, temp);
      this.closeBlock();
      return this.prepend("}");
    } else if (c["else"]) {
      this.prepend("else {");
      this.openBlock();
      res = this.transpileSequence(c["else"], context, temp != null);
      this.closeBlock();
      if (temp != null) {
        this.prepend(temp + " = " + res + " ;");
      } else {
        this.prepend(res + " ;");
      }
      return this.prepend("}");
    }
  };

  JSTranspiler.prototype.transpileCondition = function(condition, context, retain) {
    var temp;
    temp = null;
    if (retain) {
      temp = this.createTempVariable(context);
      this.prepend("  var " + temp + " = 0 ;");
    }
    this.transpileConditionCase(condition.chain, 0, context, temp);
    if (retain) {
      return temp;
    } else {
      return "";
    }
  };

  JSTranspiler.prototype.formatField = function(field) {
    if (field === "constructor") {
      field = "_constructor";
    }
    return field.toString().replace(/"/g, "\\\"");
  };

  JSTranspiler.prototype.transpileCreateObject = function(statement, context) {
    var f, j, len, ref, res;
    res = "{\n";
    ref = statement.fields;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      res += "  \"" + (this.formatField(f.field)) + "\": " + (this.transpile(f.value, context, true)) + ",\n";
    }
    res += "}";
    return res;
  };

  JSTranspiler.prototype.transpileCreateClass = function(statement, context) {
    var classvar, f, j, len, ref, res;
    if (statement.ext != null) {
      classvar = this.createTempVariable(context);
      this.prepend("var " + classvar + " = " + (this.transpile(statement.ext, context, true)) + " ;");
      if (statement.ext instanceof Program.Variable) {
        this.prepend("if (!" + classvar + ") { " + classvar + " = \"" + statement.ext.identifier + "\" }");
      }
    }
    res = "{\n";
    ref = statement.fields;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      res += "  \"" + (this.formatField(f.field)) + "\": " + (this.transpile(f.value, context, true)) + ",\n";
    }
    if (statement.ext != null) {
      res += "  \"class\": " + classvar + " , ";
    }
    res += "}";
    return res;
  };

  JSTranspiler.prototype.transpileUpdateClass = function(statement, context, variable) {
    var classvar, cls, f, j, key, len, ref, res;
    if (statement.ext != null) {
      classvar = this.createTempVariable(context);
      this.prepend("var " + classvar + " = " + (this.transpile(statement.ext, context, true)) + " ;");
      if (statement.ext instanceof Program.Variable) {
        this.prepend("if (!" + classvar + ") { " + classvar + " = \"" + statement.ext.identifier + "\" }");
      }
    }
    res = "{\n";
    ref = statement.fields;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      res += "  \"" + (this.formatField(f.field)) + "\": " + (this.transpile(f.value, context, true)) + ",\n";
    }
    if (statement.ext != null) {
      res += "  \"class\": " + classvar + " , ";
    }
    res += "}";
    cls = this.createTempVariable(context);
    key = this.createTempVariable(context);
    this.prepend("if (context.object[\"" + variable + "\"] != null) {\n  for (" + key + " in " + res + ") {\n    context.object[\"" + variable + "\"][" + key + "] = " + res + "[" + key + "] ;\n  }\n  " + cls + " = context.object[\"" + variable + "\"] ;\n}\nelse {\n  " + cls + " = " + res + " ;\n}");
    return cls;
  };

  JSTranspiler.prototype.transpileNewCall = function(statement, context) {
    var a, classvar, constructor, fconstructor, funcall, i, j, len, objvar, ref;
    funcall = statement.expression;
    classvar = this.createTempVariable(context);
    objvar = this.createTempVariable(context);
    constructor = "_msApply(" + objvar + ",\"_constructor\" ";
    fconstructor = "new " + classvar + "(";
    ref = funcall.args;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      a = ref[i];
      a = this.transpile(a, context, true);
      constructor += ", ";
      constructor += a;
      if (i > 0) {
        fconstructor += ", ";
      }
      fconstructor += a;
    }
    constructor += ") ;";
    fconstructor += ") ;";
    this.prepend("var " + classvar + " = " + (this.transpile(funcall.expression, context, true)) + " ;");
    this.prepend("if (typeof " + classvar + " == \"function\") {\n  var " + objvar + " = " + fconstructor + " ;\n} else {\n  var " + objvar + " = { \"class\": " + classvar + "} ;\n  _msResolveParentClass(" + objvar + ") ;\n  " + constructor + "\n} ");
    return objvar;
  };

  JSTranspiler.prototype.exec = function(context) {
    eval("var f = function(context) {" + this.code + " }");
    return f(context);
  };

  JSTranspiler.predefined_functions = {
    "abs": "Math.abs",
    "max": "Math.max",
    "cos": "Math.cos",
    "sin": "Math.sin"
  };

  return JSTranspiler;

})();

this.Runtime = (function() {
  function Runtime(url1, sources, resources, listener) {
    this.url = url1;
    this.sources = sources;
    this.resources = resources;
    this.listener = listener;
    this.screen = new Screen(this);
    this.audio = new AudioCore(this);
    this.keyboard = new Keyboard();
    this.gamepad = new Gamepad();
    this.asset_manager = new AssetManager(this);
    this.sprites = {};
    this.maps = {};
    this.sounds = {};
    this.music = {};
    this.assets = {};
    this.touch = {};
    this.mouse = this.screen.mouse;
    this.previous_init = null;
    this.random = new Random(0);
    this.orientation = window.orientation;
    this.aspect = window.aspect;
    this.report_errors = true;
    this.log = (function(_this) {
      return function(text) {
        return _this.listener.log(text);
      };
    })(this);
    this.update_memory = {};
  }

  Runtime.prototype.updateSource = function(file, src, reinit) {
    var err, init;
    if (reinit == null) {
      reinit = false;
    }
    if (this.vm == null) {
      return false;
    }
    if (src === this.update_memory[file]) {
      return false;
    }
    this.update_memory[file] = src;
    this.audio.cancelBeeps();
    this.screen.clear();
    try {
      this.vm.run(src, 3000, file);
      this.listener.postMessage({
        name: "compile_success",
        file: file
      });
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "init";
        err.file = file;
        this.listener.reportError(err);
        return false;
      }
      if (this.vm.runner.getFunctionSource != null) {
        init = this.vm.runner.getFunctionSource("init");
        if ((init != null) && init !== this.previous_init && reinit) {
          this.previous_init = init;
          this.vm.call("init");
          if (this.vm.error_info != null) {
            err = this.vm.error_info;
            err.type = "init";
            this.listener.reportError(err);
          }
        }
      }
      return true;
    } catch (error) {
      err = error;
      if (this.report_errors) {
        console.error(err);
        err.file = file;
        this.listener.reportError(err);
        return false;
      }
    }
  };

  Runtime.prototype.start = function() {
    var a, i, j, k, key, l, len, len1, len2, len3, len4, m, n, name, o, ref, ref1, ref2, ref3, ref4, ref5, s, value;
    ref = this.resources.images;
    for (j = 0, len = ref.length; j < len; j++) {
      i = ref[j];
      s = new Sprite(this.url + "sprites/" + i.file + "?v=" + i.version, null, i.properties);
      name = i.file.split(".")[0];
      s.name = name;
      this.sprites[name] = s;
      s.loaded = (function(_this) {
        return function() {
          _this.updateMaps();
          return _this.checkStartReady();
        };
      })(this);
    }
    if (Array.isArray(this.resources.maps)) {
      ref1 = this.resources.maps;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        m = ref1[k];
        name = m.file.split(".")[0];
        this.maps[name] = new MicroMap(this.url + ("maps/" + m.file + "?v=" + m.version), 0, 0, 0, this.sprites);
        this.maps[name].name = name;
        this.maps[name].loaded = (function(_this) {
          return function() {
            return _this.checkStartReady();
          };
        })(this);
      }
    } else if (this.resources.maps != null) {
      ref2 = this.resources.maps;
      for (key in ref2) {
        value = ref2[key];
        this.updateMap(key, 0, value);
      }
    }
    ref3 = this.resources.sounds;
    for (l = 0, len2 = ref3.length; l < len2; l++) {
      s = ref3[l];
      name = s.file.split(".")[0];
      s = new Sound(this.audio, this.url + "sounds/" + s.file + "?v=" + s.version);
      s.name = name;
      this.sounds[name] = s;
    }
    ref4 = this.resources.music;
    for (n = 0, len3 = ref4.length; n < len3; n++) {
      m = ref4[n];
      name = m.file.split(".")[0];
      m = new Music(this.audio, this.url + "music/" + m.file + "?v=" + m.version);
      m.name = name;
      this.music[name] = m;
    }
    ref5 = this.resources.assets;
    for (o = 0, len4 = ref5.length; o < len4; o++) {
      a = ref5[o];
      name = a.file.split(".")[0];
      name = name.replace(/-/g, "/");
      a.name = name;
      this.assets[name] = a;
    }
  };

  Runtime.prototype.checkStartReady = function() {
    var key, ref, ref1, value;
    if (!this.start_ready) {
      ref = this.sprites;
      for (key in ref) {
        value = ref[key];
        if (!value.ready) {
          return;
        }
      }
      ref1 = this.maps;
      for (key in ref1) {
        value = ref1[key];
        if (!value.ready) {
          return;
        }
      }
      this.start_ready = true;
      return this.startReady();
    }
  };

  Runtime.prototype.startReady = function() {
    var err, file, global, init, j, len, lib, meta, namespace, ref, ref1, src;
    meta = {
      print: (function(_this) {
        return function(text) {
          if (typeof text === "object") {
            text = Program.toString(text);
          }
          return _this.listener.log(text);
        };
      })(this)
    };
    global = {
      screen: this.screen.getInterface(),
      audio: this.audio.getInterface(),
      keyboard: this.keyboard.keyboard,
      gamepad: this.gamepad.status,
      sprites: this.sprites,
      sounds: this.sounds,
      music: this.music,
      assets: this.assets,
      asset_manager: this.asset_manager,
      maps: this.maps,
      touch: this.touch,
      mouse: this.mouse,
      fonts: window.fonts
    };
    if (window.graphics === "M3D") {
      global.M3D = M3D;
      M3D.runtime = this;
    } else if (window.graphics === "M2D") {
      global.M2D = M2D;
      M2D.runtime = this;
    } else if (window.graphics === "PIXI") {
      global.PIXI = PIXI;
      PIXI.runtime = this;
    } else if (window.graphics === "BABYLON") {
      global.BABYLON = BABYLON;
      BABYLON.runtime = this;
    }
    ref = window.ms_libs;
    for (j = 0, len = ref.length; j < len; j++) {
      lib = ref[j];
      switch (lib) {
        case "matterjs":
          global.Matter = Matter;
          break;
        case "cannonjs":
          global.CANNON = CANNON;
      }
    }
    namespace = location.pathname;
    this.vm = new MicroVM(meta, global, namespace, location.hash === "#transpiler");
    ref1 = this.sources;
    for (file in ref1) {
      src = ref1[file];
      this.updateSource(file, src, false);
    }
    if (this.vm.runner.getFunctionSource != null) {
      init = this.vm.runner.getFunctionSource("init");
      if (init != null) {
        this.previous_init = init;
        this.vm.call("init");
        if (this.vm.error_info != null) {
          err = this.vm.error_info;
          err.type = "draw";
          this.listener.reportError(err);
        }
      }
    } else {
      this.vm.call("init");
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "draw";
        this.listener.reportError(err);
      }
    }
    this.dt = 1000 / 60;
    this.last_time = Date.now();
    this.current_frame = 0;
    this.floating_frame = 0;
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.timer();
      };
    })(this));
    return this.screen.startControl();
  };

  Runtime.prototype.updateMaps = function() {
    var key, map, ref;
    ref = this.maps;
    for (key in ref) {
      map = ref[key];
      map.needs_update = true;
    }
  };

  Runtime.prototype.runCommand = function(command) {
    var err, res, warnings;
    try {
      warnings = this.vm.context.warnings;
      this.vm.clearWarnings();
      res = this.vm.run(command);
      this.reportWarnings();
      this.vm.context.warnings = warnings;
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "exec";
        this.listener.reportError(err);
      }
      return res;
    } catch (error) {
      err = error;
      return this.listener.reportError(err);
    }
  };

  Runtime.prototype.projectFileUpdated = function(type, file, version, data, properties) {
    switch (type) {
      case "sprites":
        return this.updateSprite(file, version, data, properties);
      case "maps":
        return this.updateMap(file, version, data);
      case "ms":
        return this.updateCode(file, version, data);
    }
  };

  Runtime.prototype.projectFileDeleted = function(type, file) {
    switch (type) {
      case "sprites":
        return delete this.sprites[file.substring(0, file.length - 4)];
      case "maps":
        return delete this.maps[file.substring(0, file.length - 5)];
    }
  };

  Runtime.prototype.projectOptionsUpdated = function(msg) {
    this.orientation = msg.orientation;
    this.aspect = msg.aspect;
    return this.screen.resize();
  };

  Runtime.prototype.updateSprite = function(name, version, data, properties) {
    var img;
    if (data != null) {
      data = "data:image/png;base64," + data;
      if (this.sprites[name] != null) {
        img = new Image;
        img.crossOrigin = "Anonymous";
        img.src = data;
        return img.onload = (function(_this) {
          return function() {
            _this.sprites[name].load(img, properties);
            return _this.updateMaps();
          };
        })(this);
      } else {
        this.sprites[name] = new Sprite(data, null, properties);
        this.sprites[name].name = name;
        return this.sprites[name].loaded = (function(_this) {
          return function() {
            return _this.updateMaps();
          };
        })(this);
      }
    } else {
      if (this.sprites[name] != null) {
        img = new Image;
        img.crossOrigin = "Anonymous";
        img.src = this.url + "sprites/" + name + (".png?v=" + version);
        return img.onload = (function(_this) {
          return function() {
            _this.sprites[name].load(img, properties);
            return _this.updateMaps();
          };
        })(this);
      } else {
        this.sprites[name] = new Sprite(this.url + "sprites/" + name + (".png?v=" + version), null, properties);
        this.sprites[name].name = name;
        return this.sprites[name].loaded = (function(_this) {
          return function() {
            return _this.updateMaps();
          };
        })(this);
      }
    }
  };

  Runtime.prototype.updateMap = function(name, version, data) {
    var m, url;
    if (data != null) {
      m = this.maps[name];
      if (m != null) {
        m.load(data, this.sprites);
        return m.needs_update = true;
      } else {
        m = new MicroMap(1, 1, 1, 1, this.sprites);
        m.load(data, this.sprites);
        this.maps[name] = m;
        return this.maps[name].name = name;
      }
    } else {
      url = this.url + ("maps/" + name + ".json?v=" + version);
      m = this.maps[name];
      if (m != null) {
        return m.loadFile(url);
      } else {
        this.maps[name] = new MicroMap(url, 0, 0, 0, this.sprites);
        return this.maps[name].name = name;
      }
    }
  };

  Runtime.prototype.updateCode = function(name, version, data) {
    var req, url;
    if (data != null) {
      this.sources[name] = data;
      if (this.vm != null) {
        this.vm.clearWarnings();
      }
      return this.updateSource(name, data, true);
    } else {
      url = this.url + ("ms/" + name + ".ms?v=" + version);
      req = new XMLHttpRequest();
      req.onreadystatechange = (function(_this) {
        return function(event) {
          if (req.readyState === XMLHttpRequest.DONE) {
            if (req.status === 200) {
              _this.sources[name] = req.responseText;
              return _this.updateSource(name, _this.sources[name], true);
            }
          }
        };
      })(this);
      req.open("GET", url);
      return req.send();
    }
  };

  Runtime.prototype.stop = function() {
    this.stopped = true;
    return this.audio.cancelBeeps();
  };

  Runtime.prototype.resume = function() {
    this.stopped = false;
    return requestAnimationFrame((function(_this) {
      return function() {
        return _this.timer();
      };
    })(this));
  };

  Runtime.prototype.timer = function() {
    var ds, dt, fps, i, j, ref, time;
    if (this.stopped) {
      return;
    }
    requestAnimationFrame((function(_this) {
      return function() {
        return _this.timer();
      };
    })(this));
    time = Date.now();
    if (Math.abs(time - this.last_time) > 1000) {
      this.last_time = time - 16;
    }
    dt = time - this.last_time;
    this.dt = this.dt * .9 + dt * .1;
    this.last_time = time;
    this.vm.context.global.system.fps = Math.round(fps = 1000 / this.dt);
    this.floating_frame += this.dt * 60 / 1000;
    ds = Math.min(30, Math.round(this.floating_frame - this.current_frame));
    if (ds === 0 && fps > 58) {
      ds = 1;
      this.floating_frame = this.current_frame + .5;
    }
    for (i = j = 1, ref = ds; j <= ref; i = j += 1) {
      this.updateCall();
    }
    this.current_frame += ds;
    return this.drawCall();
  };

  Runtime.prototype.updateCall = function() {
    var err;
    this.updateControls();
    try {
      this.vm.call("update");
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "update";
        return this.listener.reportError(err);
      }
    } catch (error) {
      err = error;
      if (this.report_errors) {
        return this.listener.reportError(err);
      }
    }
  };

  Runtime.prototype.drawCall = function() {
    var err;
    try {
      this.screen.initDraw();
      this.screen.updateInterface();
      this.vm.call("draw");
      this.reportWarnings();
      if (this.vm.error_info != null) {
        err = this.vm.error_info;
        err.type = "draw";
        return this.listener.reportError(err);
      }
    } catch (error) {
      err = error;
      if (this.report_errors) {
        return this.listener.reportError(err);
      }
    }
  };

  Runtime.prototype.reportWarnings = function() {
    var key, ref, ref1, ref2, results, value;
    if (this.vm != null) {
      ref = this.vm.context.warnings.invoking_non_function;
      for (key in ref) {
        value = ref[key];
        if (!value.reported) {
          value.reported = true;
          this.listener.reportError({
            error: "",
            type: "non_function",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          });
        }
      }
      ref1 = this.vm.context.warnings.using_undefined_variable;
      for (key in ref1) {
        value = ref1[key];
        if (!value.reported) {
          value.reported = true;
          this.listener.reportError({
            error: "",
            type: "undefined_variable",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          });
        }
      }
      ref2 = this.vm.context.warnings.assigning_field_to_undefined;
      results = [];
      for (key in ref2) {
        value = ref2[key];
        if (!value.reported) {
          value.reported = true;
          results.push(this.listener.reportError({
            error: "",
            type: "assigning_undefined",
            expression: value.expression,
            line: value.line,
            column: value.column,
            file: value.file
          }));
        } else {
          results.push(void 0);
        }
      }
      return results;
    }
  };

  Runtime.prototype.updateControls = function() {
    var err, j, key, len, t, touches;
    touches = Object.keys(this.screen.touches);
    this.touch.touching = touches.length > 0;
    this.touch.touches = [];
    for (j = 0, len = touches.length; j < len; j++) {
      key = touches[j];
      t = this.screen.touches[key];
      this.touch.x = t.x;
      this.touch.y = t.y;
      this.touch.touches.push({
        x: t.x,
        y: t.y,
        id: key
      });
    }
    if (this.mouse.pressed && !this.previous_mouse_pressed) {
      this.previous_mouse_pressed = true;
      this.mouse.press = 1;
    } else {
      this.mouse.press = 0;
    }
    if (!this.mouse.pressed && this.previous_mouse_pressed) {
      this.previous_mouse_pressed = false;
      this.mouse.release = 1;
    } else {
      this.mouse.release = 0;
    }
    if (this.touch.touching && !this.previous_touch) {
      this.previous_touch = true;
      this.touch.press = 1;
    } else {
      this.touch.press = 0;
    }
    if (!this.touch.touching && this.previous_touch) {
      this.previous_touch = false;
      this.touch.release = 1;
    } else {
      this.touch.release = 0;
    }
    this.gamepad.update();
    this.keyboard.update();
    try {
      this.vm.context.global.system.inputs.gamepad = this.gamepad.count > 0 ? 1 : 0;
    } catch (error) {
      err = error;
    }
  };

  Runtime.prototype.getAssetURL = function(asset) {
    return this.url + "assets/" + asset + ".glb";
  };

  return Runtime;

})();

this.Screen = (function() {
  function Screen(runtime) {
    this.runtime = runtime;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1080;
    this.canvas.height = 1920;
    this.touches = {};
    this.mouse = {
      x: -10000,
      y: -10000,
      pressed: 0,
      left: 0,
      middle: 0,
      right: 0
    };
    this.translation_x = 0;
    this.translation_y = 0;
    this.anchor_x = 0;
    this.anchor_y = 0;
    this.supersampling = this.previous_supersampling = 1;
    this.font = "BitCell";
    this.font_load_requested = {};
    this.font_loaded = {};
    this.loadFont(this.font);
    this.initContext();
    this.cursor = "default";
    this.canvas.addEventListener("mousemove", (function(_this) {
      return function() {
        _this.last_mouse_move = Date.now();
        if (_this.cursor !== "default" && _this.cursor_visibility === "auto") {
          _this.cursor = "default";
          return _this.canvas.style.cursor = "default";
        }
      };
    })(this));
    setInterval(((function(_this) {
      return function() {
        return _this.checkMouseCursor();
      };
    })(this)), 1000);
    this.cursor_visibility = "auto";
  }

  Screen.prototype.checkMouseCursor = function() {
    if (Date.now() > this.last_mouse_move + 4000 && this.cursor_visibility === "auto") {
      if (this.cursor !== "none") {
        this.cursor = "none";
        return this.canvas.style.cursor = "none";
      }
    }
  };

  Screen.prototype.setCursorVisible = function(visible) {
    this.cursor_visibility = visible;
    if (visible) {
      this.cursor = "default";
      return this.canvas.style.cursor = "default";
    } else {
      this.cursor = "none";
      return this.canvas.style.cursor = "none";
    }
  };

  Screen.prototype.initContext = function() {
    var b, c, j, len1, ratio, ref;
    c = this.canvas.getContext("2d", {
      alpha: false
    });
    if (c !== this.context) {
      this.context = c;
    } else {
      this.context.restore();
    }
    this.context.save();
    this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
    ratio = Math.min(this.canvas.width / 200, this.canvas.height / 200);
    this.context.scale(ratio, ratio);
    this.width = this.canvas.width / ratio;
    this.height = this.canvas.height / ratio;
    this.alpha = 1;
    this.line_width = 1;
    this.object_rotation = 0;
    this.object_scale_x = 1;
    this.object_scale_y = 1;
    this.context.lineCap = "round";
    this.blending = {
      normal: "source-over",
      additive: "lighter"
    };
    ref = ["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "copy", "xor", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    for (j = 0, len1 = ref.length; j < len1; j++) {
      b = ref[j];
      this.blending[b] = b;
    }
  };

  Screen.prototype.getInterface = function() {
    var screen;
    if (this["interface"] != null) {
      return this["interface"];
    }
    screen = this;
    return this["interface"] = {
      width: this.width,
      height: this.height,
      clear: function(color) {
        return screen.clear(color);
      },
      setColor: function(color) {
        return screen.setColor(color);
      },
      setAlpha: function(alpha) {
        return screen.setAlpha(alpha);
      },
      setBlending: function(blending) {
        return screen.setBlending(blending);
      },
      setLinearGradient: function(x1, y1, x2, y2, c1, c2) {
        return screen.setLinearGradient(x1, y1, x2, y2, c1, c2);
      },
      setRadialGradient: function(x, y, radius, c1, c2) {
        return screen.setRadialGradient(x, y, radius, c1, c2);
      },
      setFont: function(font) {
        return screen.setFont(font);
      },
      setTranslation: function(tx, ty) {
        return screen.setTranslation(tx, ty);
      },
      setDrawAnchor: function(ax, ay) {
        return screen.setDrawAnchor(ax, ay);
      },
      setDrawRotation: function(rotation) {
        return screen.setDrawRotation(rotation);
      },
      setDrawScale: function(x, y) {
        return screen.setDrawScale(x, y);
      },
      fillRect: function(x, y, w, h, c) {
        return screen.fillRect(x, y, w, h, c);
      },
      fillRoundRect: function(x, y, w, h, r, c) {
        return screen.fillRoundRect(x, y, w, h, r, c);
      },
      fillRound: function(x, y, w, h, c) {
        return screen.fillRound(x, y, w, h, c);
      },
      drawRect: function(x, y, w, h, c) {
        return screen.drawRect(x, y, w, h, c);
      },
      drawRoundRect: function(x, y, w, h, r, c) {
        return screen.drawRoundRect(x, y, w, h, r, c);
      },
      drawRound: function(x, y, w, h, c) {
        return screen.drawRound(x, y, w, h, c);
      },
      drawSprite: function(sprite, x, y, w, h) {
        return screen.drawSprite(sprite, x, y, w, h);
      },
      drawSpritePart: function(sprite, sx, sy, sw, sh, x, y, w, h) {
        return screen.drawSpritePart(sprite, sx, sy, sw, sh, x, y, w, h);
      },
      drawMap: function(map, x, y, w, h) {
        return screen.drawMap(map, x, y, w, h);
      },
      drawText: function(text, x, y, size, color) {
        return screen.drawText(text, x, y, size, color);
      },
      drawTextOutline: function(text, x, y, size, color) {
        return screen.drawTextOutline(text, x, y, size, color);
      },
      textWidth: function(text, size) {
        return screen.textWidth(text, size);
      },
      setLineWidth: function(width) {
        return screen.setLineWidth(width);
      },
      setLineDash: function(dash) {
        return screen.setLineDash(dash);
      },
      drawLine: function(x1, y1, x2, y2, color) {
        return screen.drawLine(x1, y1, x2, y2, color);
      },
      drawPolygon: function() {
        return screen.drawPolygon(arguments);
      },
      drawPolyline: function() {
        return screen.drawPolyline(arguments);
      },
      fillPolygon: function() {
        return screen.fillPolygon(arguments);
      },
      setCursorVisible: function(visible) {
        return screen.setCursorVisible(visible);
      },
      loadFont: function(font) {
        return screen.loadFont(font);
      },
      isFontReady: function(font) {
        return screen.isFontReady(font);
      }
    };
  };

  Screen.prototype.updateInterface = function() {
    this["interface"].width = this.width;
    return this["interface"].height = this.height;
  };

  Screen.prototype.clear = function(color) {
    var blending_save, c, s;
    c = this.context.fillStyle;
    s = this.context.strokeStyle;
    blending_save = this.context.globalCompositeOperation;
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = "source-over";
    if (color != null) {
      this.setColor(color);
    } else {
      this.context.fillStyle = "#000";
    }
    this.context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    this.context.fillStyle = c;
    this.context.strokeStyle = s;
    return this.context.globalCompositeOperation = blending_save;
  };

  Screen.prototype.initDraw = function() {
    this.alpha = 1;
    this.line_width = 1;
    if (this.supersampling !== this.previous_supersampling) {
      this.resize();
      return this.previous_supersampling = this.supersampling;
    }
  };

  Screen.prototype.setColor = function(color) {
    var b, c, g, r;
    if (color == null) {
      return;
    }
    if (!Number.isNaN(Number.parseInt(color))) {
      r = (Math.floor(color / 100) % 10) / 9 * 255;
      g = (Math.floor(color / 10) % 10) / 9 * 255;
      b = (Math.floor(color) % 10) / 9 * 255;
      c = 0xFF000000;
      c += r << 16;
      c += g << 8;
      c += b;
      c = "#" + c.toString(16).substring(2, 8);
      this.context.fillStyle = c;
      return this.context.strokeStyle = c;
    } else if (typeof color === "string") {
      this.context.fillStyle = color;
      return this.context.strokeStyle = color;
    }
  };

  Screen.prototype.setAlpha = function(alpha1) {
    this.alpha = alpha1;
  };

  Screen.prototype.setBlending = function(blending) {
    blending = this.blending[blending || "normal"] || "source-over";
    return this.context.globalCompositeOperation = blending;
  };

  Screen.prototype.setLineWidth = function(line_width) {
    this.line_width = line_width;
  };

  Screen.prototype.setLineDash = function(dash) {
    if (!Array.isArray(dash)) {
      return this.context.setLineDash([]);
    } else {
      return this.context.setLineDash(dash);
    }
  };

  Screen.prototype.setLinearGradient = function(x1, y1, x2, y2, c1, c2) {
    var grd;
    grd = this.context.createLinearGradient(x1, -y1, x2, -y2);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  Screen.prototype.setRadialGradient = function(x, y, radius, c1, c2) {
    var grd;
    grd = this.context.createRadialGradient(x, -y, 0, x, -y, radius);
    grd.addColorStop(0, c1);
    grd.addColorStop(1, c2);
    this.context.fillStyle = grd;
    return this.context.strokeStyle = grd;
  };

  Screen.prototype.setFont = function(font) {
    this.font = font || "Verdana";
    return this.loadFont(this.font);
  };

  Screen.prototype.loadFont = function(font) {
    var err;
    if (font == null) {
      font = "BitCell";
    }
    if (!this.font_load_requested[font]) {
      this.font_load_requested[font] = true;
      try {
        if ((document.fonts != null) && (document.fonts.load != null)) {
          document.fonts.load("16pt " + font);
        }
      } catch (error) {
        err = error;
      }
    }
    return 1;
  };

  Screen.prototype.isFontReady = function(font) {
    var err, res;
    if (font == null) {
      font = this.font;
    }
    if (this.font_loaded[font]) {
      return 1;
    }
    try {
      if ((document.fonts != null) && (document.fonts.check != null)) {
        res = document.fonts.check("16pt " + font);
        if (res) {
          this.font_loaded[font] = res;
        }
        if (res) {
          return 1;
        } else {
          return 0;
        }
      }
    } catch (error) {
      err = error;
    }
    return 1;
  };

  Screen.prototype.setTranslation = function(translation_x, translation_y) {
    this.translation_x = translation_x;
    this.translation_y = translation_y;
  };

  Screen.prototype.setDrawAnchor = function(anchor_x, anchor_y) {
    this.anchor_x = anchor_x;
    this.anchor_y = anchor_y;
    if (typeof this.anchor_x !== "number") {
      this.anchor_x = 0;
    }
    if (typeof this.anchor_y !== "number") {
      return this.anchor_y = 0;
    }
  };

  Screen.prototype.setDrawRotation = function(object_rotation) {
    this.object_rotation = object_rotation;
  };

  Screen.prototype.setDrawScale = function(object_scale_x, object_scale_y) {
    this.object_scale_x = object_scale_x;
    this.object_scale_y = object_scale_y != null ? object_scale_y : this.object_scale_x;
  };

  Screen.prototype.initDrawOp = function(x, y) {
    var res;
    res = false;
    if (this.translation_x !== 0 || this.translation_y !== 0) {
      this.context.save();
      res = true;
      this.context.translate(x + this.translation_x, y - this.translation_y);
    }
    if (this.object_rotation !== 0 || this.object_scale_x !== 1 || this.object_scale_y !== 1) {
      if (!res) {
        this.context.save();
        res = true;
        this.context.translate(x, y);
      }
      if (this.object_rotation !== 0) {
        this.context.rotate(-this.object_rotation / 180 * Math.PI);
      }
      if (this.object_scale_x !== 1 || this.object_scale_y !== 1) {
        this.context.scale(this.object_scale_x, this.object_scale_y);
      }
    }
    return res;
  };

  Screen.prototype.closeDrawOp = function(x, y) {
    return this.context.restore();
  };

  Screen.prototype.fillRect = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, -y)) {
      this.context.fillRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.fillRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    if (this.initDrawOp(x, -y)) {
      this.context.fillRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillRoundRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  Screen.prototype.fillRound = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, -y)) {
      this.context.beginPath();
      this.context.ellipse(-this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.fill();
      return this.closeDrawOp(x, -y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.fill();
    }
  };

  Screen.prototype.drawRect = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawRoundRect = function(x, y, w, h, round, color) {
    if (round == null) {
      round = 10;
    }
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeRoundRect(-w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h, round);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeRoundRect(x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h, round);
    }
  };

  Screen.prototype.drawRound = function(x, y, w, h, color) {
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    w = Math.abs(w);
    h = Math.abs(h);
    if (this.initDrawOp(x, -y)) {
      this.context.beginPath();
      this.context.ellipse(0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      this.context.stroke();
      return this.closeDrawOp(x, -y);
    } else {
      this.context.beginPath();
      this.context.ellipse(x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2, w / 2, h / 2, 0, 0, Math.PI * 2, false);
      return this.context.stroke();
    }
  };

  Screen.prototype.drawLine = function(x1, y1, x2, y2, color) {
    var transform;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(x1, -y1);
    this.context.lineTo(x2, -y2);
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.drawPolyline = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.drawPolygon = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.closePath();
    this.context.stroke();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.fillPolygon = function(args) {
    var i, j, len, ref, transform;
    if (args.length > 0 && args.length % 2 === 1 && typeof args[args.length - 1] === "string") {
      this.setColor(args[args.length - 1]);
    }
    if (Array.isArray(args[0])) {
      if ((args[1] != null) && typeof args[1] === "string") {
        this.setColor(args[1]);
      }
      args = args[0];
    }
    this.context.globalAlpha = this.alpha;
    this.context.lineWidth = this.line_width;
    if (args.length < 4) {
      return;
    }
    len = Math.floor(args.length / 2);
    transform = this.initDrawOp(0, 0);
    this.context.beginPath();
    this.context.moveTo(args[0], -args[1]);
    for (i = j = 1, ref = len - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      this.context.lineTo(args[i * 2], -args[i * 2 + 1]);
    }
    this.context.fill();
    if (transform) {
      return this.closeDrawOp();
    }
  };

  Screen.prototype.textWidth = function(text, size) {
    this.context.font = size + "pt " + this.font;
    return this.context.measureText(text).width;
  };

  Screen.prototype.drawText = function(text, x, y, size, color) {
    var h, w;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, -y)) {
      this.context.fillText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.fillText(text, x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2);
    }
  };

  Screen.prototype.drawTextOutline = function(text, x, y, size, color) {
    var h, w;
    this.setColor(color);
    this.context.globalAlpha = this.alpha;
    this.context.font = size + "pt " + this.font;
    this.context.lineWidth = this.line_width;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    w = this.context.measureText(text).width;
    h = size;
    if (this.initDrawOp(x, -y)) {
      this.context.strokeText(text, 0 - this.anchor_x * w / 2, 0 + this.anchor_y * h / 2);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.strokeText(text, x - this.anchor_x * w / 2, -y + this.anchor_y * h / 2);
    }
  };

  Screen.prototype.getSpriteFrame = function(sprite) {
    var dt, frame, s;
    frame = null;
    if (typeof sprite === "string") {
      s = this.runtime.sprites[sprite];
      if (s != null) {
        sprite = s;
      } else {
        s = sprite.split(".");
        if (s.length > 1) {
          sprite = this.runtime.sprites[s[0]];
          frame = s[1] | 0;
        }
      }
    }
    if ((sprite == null) || !sprite.ready) {
      return null;
    }
    if (sprite.frames.length > 1) {
      if (frame == null) {
        dt = 1000 / sprite.fps;
        frame = Math.floor((Date.now() - sprite.animation_start) / dt) % sprite.frames.length;
      }
      if (frame >= 0 && frame < sprite.frames.length) {
        return sprite.frames[frame].canvas;
      } else {
        return sprite.frames[0].canvas;
      }
    } else if (sprite.frames[0] != null) {
      return sprite.frames[0].canvas;
    } else {
      return null;
    }
  };

  Screen.prototype.drawSprite = function(sprite, x, y, w, h) {
    var canvas;
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / canvas.width * canvas.height;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = false;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(canvas, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(canvas, x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawSpritePart = function(sprite, sx, sy, sw, sh, x, y, w, h) {
    var canvas;
    canvas = this.getSpriteFrame(sprite);
    if (canvas == null) {
      return;
    }
    if (!h) {
      h = w / sw * sh;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = false;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(canvas, sx, sy, sw, sh, -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(canvas, sx, sy, sw, sh, x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.drawMap = function(map, x, y, w, h) {
    if (typeof map === "string") {
      map = this.runtime.maps[map];
    }
    if ((map == null) || !map.ready || (map.canvas == null)) {
      return;
    }
    this.context.globalAlpha = this.alpha;
    this.context.imageSmoothingEnabled = false;
    if (this.initDrawOp(x, -y)) {
      this.context.drawImage(map.getCanvas(), -w / 2 - this.anchor_x * w / 2, -h / 2 + this.anchor_y * h / 2, w, h);
      return this.closeDrawOp(x, -y);
    } else {
      return this.context.drawImage(map.getCanvas(), x - w / 2 - this.anchor_x * w / 2, -y - h / 2 + this.anchor_y * h / 2, w, h);
    }
  };

  Screen.prototype.resize = function() {
    var backingStoreRatio, ch, cw, devicePixelRatio, h, min, r, ratio, w;
    cw = window.innerWidth;
    ch = window.innerHeight;
    ratio = {
      "4x3": 4 / 3,
      "16x9": 16 / 9,
      "2x1": 2 / 1,
      "1x1": 1 / 1,
      ">4x3": 4 / 3,
      ">16x9": 16 / 9,
      ">2x1": 2 / 1,
      ">1x1": 1 / 1
    }[this.runtime.aspect];
    min = this.runtime.aspect.startsWith(">");
    if (ratio != null) {
      if (min) {
        switch (this.runtime.orientation) {
          case "portrait":
            ratio = Math.max(ratio, ch / cw);
            break;
          case "landscape":
            ratio = Math.max(ratio, cw / ch);
            break;
          default:
            if (ch > cw) {
              ratio = Math.max(ratio, ch / cw);
            } else {
              ratio = Math.max(ratio, cw / ch);
            }
        }
      }
      switch (this.runtime.orientation) {
        case "portrait":
          r = Math.min(cw, ch / ratio) / cw;
          w = cw * r;
          h = cw * r * ratio;
          break;
        case "landscape":
          r = Math.min(cw / ratio, ch) / ch;
          w = ch * r * ratio;
          h = ch * r;
          break;
        default:
          if (cw > ch) {
            r = Math.min(cw / ratio, ch) / ch;
            w = ch * r * ratio;
            h = ch * r;
          } else {
            r = Math.min(cw, ch / ratio) / cw;
            w = cw * r;
            h = cw * r * ratio;
          }
      }
    } else {
      w = cw;
      h = ch;
    }
    this.canvas.style["margin-top"] = Math.round((ch - h) / 2) + "px";
    this.canvas.style.width = Math.round(w) + "px";
    this.canvas.style.height = Math.round(h) + "px";
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
    this.ratio = devicePixelRatio / backingStoreRatio * Math.max(1, Math.min(2, this.supersampling));
    this.width = w * this.ratio;
    this.height = h * this.ratio;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    return this.initContext();
  };

  Screen.prototype.startControl = function(element) {
    var backingStoreRatio, devicePixelRatio;
    this.element = element;
    this.canvas.addEventListener("touchstart", (function(_this) {
      return function(event) {
        return _this.touchStart(event);
      };
    })(this));
    this.canvas.addEventListener("touchmove", (function(_this) {
      return function(event) {
        return _this.touchMove(event);
      };
    })(this));
    document.addEventListener("touchend", (function(_this) {
      return function(event) {
        return _this.touchRelease(event);
      };
    })(this));
    document.addEventListener("touchcancel", (function(_this) {
      return function(event) {
        return _this.touchRelease(event);
      };
    })(this));
    this.canvas.addEventListener("mousedown", (function(_this) {
      return function(event) {
        return _this.mouseDown(event);
      };
    })(this));
    this.canvas.addEventListener("mousemove", (function(_this) {
      return function(event) {
        return _this.mouseMove(event);
      };
    })(this));
    document.addEventListener("mouseup", (function(_this) {
      return function(event) {
        return _this.mouseUp(event);
      };
    })(this));
    devicePixelRatio = window.devicePixelRatio || 1;
    backingStoreRatio = this.context.webkitBackingStorePixelRatio || this.context.mozBackingStorePixelRatio || this.context.msBackingStorePixelRatio || this.context.oBackingStorePixelRatio || this.context.backingStorePixelRatio || 1;
    return this.ratio = devicePixelRatio / backingStoreRatio;
  };

  Screen.prototype.touchStart = function(event) {
    var b, i, j, min, ref, t, x, y;
    event.preventDefault();
    event.stopPropagation();
    b = this.canvas.getBoundingClientRect();
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
      x = (t.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
      y = (this.canvas.clientHeight / 2 - (t.clientY - b.top)) / min * 200;
      this.touches[t.identifier] = {
        x: x,
        y: y
      };
      this.mouse.x = x;
      this.mouse.y = y;
      this.mouse.pressed = 1;
      this.mouse.left = 1;
    }
    return false;
  };

  Screen.prototype.touchMove = function(event) {
    var b, i, j, min, ref, t, x, y;
    event.preventDefault();
    event.stopPropagation();
    b = this.canvas.getBoundingClientRect();
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      if (this.touches[t.identifier] != null) {
        min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
        x = (t.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
        y = (this.canvas.clientHeight / 2 - (t.clientY - b.top)) / min * 200;
        this.touches[t.identifier].x = x;
        this.touches[t.identifier].y = y;
        this.mouse.x = x;
        this.mouse.y = y;
      }
    }
    return false;
  };

  Screen.prototype.touchRelease = function(event) {
    var i, j, ref, t, x, y;
    for (i = j = 0, ref = event.changedTouches.length - 1; j <= ref; i = j += 1) {
      t = event.changedTouches[i];
      x = (t.clientX - this.canvas.offsetLeft) * this.ratio;
      y = (t.clientY - this.canvas.offsetTop) * this.ratio;
      delete this.touches[t.identifier];
      this.mouse.pressed = 0;
      this.mouse.left = 0;
      this.mouse.right = 0;
      this.mouse.middle = 0;
    }
    return false;
  };

  Screen.prototype.mouseDown = function(event) {
    var b, min, x, y;
    this.mousepressed = true;
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    this.touches["mouse"] = {
      x: x,
      y: y
    };
    this.mouse.x = x;
    this.mouse.y = y;
    switch (event.button) {
      case 0:
        this.mouse.left = 1;
        break;
      case 1:
        this.mouse.middle = 1;
        break;
      case 2:
        this.mouse.right = 1;
    }
    this.mouse.pressed = Math.min(1, this.mouse.left + this.mouse.right + this.mouse.middle);
    return false;
  };

  Screen.prototype.mouseMove = function(event) {
    var b, min, x, y;
    event.preventDefault();
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    if (this.touches["mouse"] != null) {
      this.touches["mouse"].x = x;
      this.touches["mouse"].y = y;
    }
    this.mouse.x = x;
    this.mouse.y = y;
    return false;
  };

  Screen.prototype.mouseUp = function(event) {
    var b, min, x, y;
    delete this.touches["mouse"];
    b = this.canvas.getBoundingClientRect();
    min = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
    x = (event.clientX - b.left - this.canvas.clientWidth / 2) / min * 200;
    y = (this.canvas.clientHeight / 2 - (event.clientY - b.top)) / min * 200;
    this.mouse.x = x;
    this.mouse.y = y;
    switch (event.button) {
      case 0:
        this.mouse.left = 0;
        break;
      case 1:
        this.mouse.middle = 0;
        break;
      case 2:
        this.mouse.right = 0;
    }
    this.mouse.pressed = Math.min(1, this.mouse.left + this.mouse.right + this.mouse.middle);
    return false;
  };

  Screen.prototype.takePicture = function(callback) {
    return callback(this.canvas.toDataURL());
  };

  return Screen;

})();

this.AssetManager = (function() {
  function AssetManager(runtime) {
    this.runtime = runtime;
  }

  AssetManager.prototype.loadFont = function(font) {
    var err, file, name, split;
    if (typeof font !== "string") {
      return;
    }
    file = font.replace(/\//g, "-");
    split = file.split("-");
    name = split[split.length - 1];
    try {
      font = new FontFace(name, "url(assets/" + file + ".ttf)");
      return font.load().then((function(_this) {
        return function() {
          return document.fonts.add(font);
        };
      })(this));
    } catch (error) {
      err = error;
      return console.error(err);
    }
  };

  AssetManager.prototype.loadModel = function(path, scene, callback) {
    var loader;
    if (typeof BABYLON === "undefined" || BABYLON === null) {
      return;
    }
    loader = {
      ready: 0
    };
    if (this.runtime.assets[path] != null) {
      path = this.runtime.assets[path].file;
    } else {
      path = path.replace(/\//g, "-");
      path += ".glb";
    }
    return BABYLON.SceneLoader.LoadAssetContainer("", "assets/" + path, scene, (function(_this) {
      return function(container) {
        loader.container = container;
        loader.ready = 1;
        return callback(container);
      };
    })(this));
  };

  AssetManager.prototype.loadJSON = function(path, callback) {
    var loader;
    path = path.replace(/\//g, "-");
    path = "assets/" + path + ".json";
    loader = {
      ready: 0
    };
    fetch(path).then((function(_this) {
      return function(result) {
        return result.json().then(function(data) {
          loader.data = data;
          loader.ready = 1;
          return callback(data);
        });
      };
    })(this));
    return loader;
  };

  AssetManager.prototype.loadText = function(path, callback, ext) {
    var loader;
    if (ext == null) {
      ext = "txt";
    }
    path = path.replace(/\//g, "-");
    path = "assets/" + path + "." + ext;
    loader = {
      ready: 0
    };
    fetch(path).then((function(_this) {
      return function(result) {
        return result.text().then(function(text) {
          loader.text = text;
          loader.ready = 1;
          return callback(text);
        });
      };
    })(this));
    return loader;
  };

  AssetManager.prototype.loadCSV = function(path, callback) {
    return this.loadText(path, callback, "csv");
  };

  return AssetManager;

})();

this.Keyboard = (function() {
  function Keyboard() {
    document.addEventListener("keydown", (function(_this) {
      return function(event) {
        return _this.keydown(event);
      };
    })(this));
    document.addEventListener("keyup", (function(_this) {
      return function(event) {
        return _this.keyup(event);
      };
    })(this));
    this.keyboard = {
      press: {},
      release: {}
    };
    this.previous = {};
  }

  Keyboard.prototype.convertCode = function(code) {
    var c, i, j, low, ref, res;
    res = "";
    low = false;
    for (i = j = 0, ref = code.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      c = code.charAt(i);
      if (c === c.toUpperCase() && low) {
        res += "_";
        low = false;
      } else {
        low = true;
      }
      res += c.toUpperCase();
    }
    return res;
  };

  Keyboard.prototype.keydown = function(event) {
    var code, key;
    event.preventDefault();
    code = event.code;
    key = event.key;
    this.keyboard[this.convertCode(code)] = 1;
    this.keyboard[key.toUpperCase()] = 1;
    return this.updateDirectional();
  };

  Keyboard.prototype.keyup = function(event) {
    var code, key;
    code = event.code;
    key = event.key;
    this.keyboard[this.convertCode(code)] = 0;
    this.keyboard[key.toUpperCase()] = 0;
    return this.updateDirectional();
  };

  Keyboard.prototype.updateDirectional = function() {
    this.keyboard.UP = this.keyboard.KEY_W || this.keyboard.ARROW_UP;
    this.keyboard.DOWN = this.keyboard.KEY_S || this.keyboard.ARROW_DOWN;
    this.keyboard.LEFT = this.keyboard.KEY_A || this.keyboard.ARROW_LEFT;
    return this.keyboard.RIGHT = this.keyboard.KEY_D || this.keyboard.ARROW_RIGHT;
  };

  Keyboard.prototype.update = function() {
    var key;
    for (key in this.keyboard.press) {
      this.keyboard.press[key] = 0;
    }
    for (key in this.keyboard.release) {
      this.keyboard.release[key] = 0;
    }
    for (key in this.previous) {
      if (this.previous[key] && !this.keyboard[key]) {
        this.keyboard.release[key] = 1;
      }
    }
    for (key in this.keyboard) {
      if (key === "press" || key === "release") {
        continue;
      }
      if (this.keyboard[key] && !this.previous[key]) {
        this.keyboard.press[key] = 1;
      }
    }
    for (key in this.previous) {
      this.previous[key] = 0;
    }
    for (key in this.keyboard) {
      if (key === "press" || key === "release") {
        continue;
      }
      this.previous[key] = this.keyboard[key];
    }
  };

  return Keyboard;

})();

this.Gamepad = (function() {
  function Gamepad(listener, index) {
    var pads;
    this.listener = listener;
    this.index = index != null ? index : 0;
    if (navigator.getGamepads != null) {
      pads = navigator.getGamepads();
      if (this.index < pads.length && (pads[this.index] != null)) {
        this.pad = pads[this.index];
      }
    }
    this.buttons_map = {
      0: "A",
      1: "B",
      2: "X",
      3: "Y",
      4: "LB",
      5: "RB",
      8: "VIEW",
      9: "MENU",
      10: "LS",
      11: "RS",
      12: "DPAD_UP",
      13: "DPAD_DOWN",
      14: "DPAD_LEFT",
      15: "DPAD_RIGHT"
    };
    this.triggers_map = {
      6: "LT",
      7: "RT"
    };
    this.status = {
      press: {},
      release: {}
    };
    this.previous = {
      global: {},
      0: {},
      1: {},
      2: {},
      3: {}
    };
  }

  Gamepad.prototype.update = function() {
    var angle, i, j, k, key, l, len, len1, len2, m, n, o, pad, pad_count, pads, r, ref, ref1, ref2, ref3, ref4, ref5, ref6, value, x, y;
    pads = navigator.getGamepads();
    pad_count = 0;
    for (i = j = 0, len = pads.length; j < len; i = ++j) {
      pad = pads[i];
      if (pad == null) {
        break;
      }
      pad_count++;
      if (!this.status[i]) {
        this.status[i] = {
          press: {},
          release: {}
        };
      }
      ref = this.buttons_map;
      for (key in ref) {
        value = ref[key];
        if (pad.buttons[key] != null) {
          this.status[i][value] = pad.buttons[key].pressed ? 1 : 0;
        }
      }
      ref1 = this.triggers_map;
      for (key in ref1) {
        value = ref1[key];
        if (pad.buttons[key] != null) {
          this.status[i][value] = pad.buttons[key].value;
        }
      }
      if (pad.axes.length >= 2) {
        x = pad.axes[0];
        y = -pad.axes[1];
        r = Math.sqrt(x * x + y * y);
        angle = Math.floor(((Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 360);
        this.status[i].LEFT_STICK_ANGLE = angle;
        this.status[i].LEFT_STICK_AMOUNT = r;
        this.status[i].LEFT_STICK_UP = y > .5;
        this.status[i].LEFT_STICK_DOWN = y < -.5;
        this.status[i].LEFT_STICK_LEFT = x < -.5;
        this.status[i].LEFT_STICK_RIGHT = x > .5;
      }
      if (pad.axes.length >= 4) {
        x = pad.axes[2];
        y = -pad.axes[3];
        r = Math.sqrt(x * x + y * y);
        angle = Math.floor(((Math.atan2(y, x) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 360);
        this.status[i].RIGHT_STICK_ANGLE = angle;
        this.status[i].RIGHT_STICK_AMOUNT = r;
        this.status[i].RIGHT_STICK_UP = y > .5;
        this.status[i].RIGHT_STICK_DOWN = y < -.5;
        this.status[i].RIGHT_STICK_LEFT = x < -.5;
        this.status[i].RIGHT_STICK_RIGHT = x > .5;
      }
    }
    ref2 = this.buttons_map;
    for (key in ref2) {
      value = ref2[key];
      this.status[value] = 0;
      for (k = 0, len1 = pads.length; k < len1; k++) {
        pad = pads[k];
        if (pad == null) {
          break;
        }
        if ((pad.buttons[key] != null) && pad.buttons[key].pressed) {
          this.status[value] = 1;
        }
      }
    }
    ref3 = this.triggers_map;
    for (key in ref3) {
      value = ref3[key];
      this.status[value] = 0;
      for (l = 0, len2 = pads.length; l < len2; l++) {
        pad = pads[l];
        if (pad == null) {
          break;
        }
        if (pad.buttons[key] != null) {
          this.status[value] = pad.buttons[key].value;
        }
      }
    }
    this.status.UP = 0;
    this.status.DOWN = 0;
    this.status.LEFT = 0;
    this.status.RIGHT = 0;
    this.status.LEFT_STICK_UP = 0;
    this.status.LEFT_STICK_DOWN = 0;
    this.status.LEFT_STICK_LEFT = 0;
    this.status.LEFT_STICK_RIGHT = 0;
    this.status.RIGHT_STICK_UP = 0;
    this.status.RIGHT_STICK_DOWN = 0;
    this.status.RIGHT_STICK_LEFT = 0;
    this.status.RIGHT_STICK_RIGHT = 0;
    this.status.LEFT_STICK_ANGLE = 0;
    this.status.LEFT_STICK_AMOUNT = 0;
    this.status.RIGHT_STICK_ANGLE = 0;
    this.status.RIGHT_STICK_AMOUNT = 0;
    this.status.RT = 0;
    this.status.LT = 0;
    for (i = m = 0, ref4 = pad_count - 1; m <= ref4; i = m += 1) {
      this.status[i].UP = this.status[i].DPAD_UP || this.status[i].LEFT_STICK_UP || this.status[i].RIGHT_STICK_UP;
      this.status[i].DOWN = this.status[i].DPAD_DOWN || this.status[i].LEFT_STICK_DOWN || this.status[i].RIGHT_STICK_DOWN;
      this.status[i].LEFT = this.status[i].DPAD_LEFT || this.status[i].LEFT_STICK_LEFT || this.status[i].RIGHT_STICK_LEFT;
      this.status[i].RIGHT = this.status[i].DPAD_RIGHT || this.status[i].LEFT_STICK_RIGHT || this.status[i].RIGHT_STICK_RIGHT;
      if (this.status[i].UP) {
        this.status.UP = 1;
      }
      if (this.status[i].DOWN) {
        this.status.DOWN = 1;
      }
      if (this.status[i].LEFT) {
        this.status.LEFT = 1;
      }
      if (this.status[i].RIGHT) {
        this.status.RIGHT = 1;
      }
      if (this.status[i].LEFT_STICK_UP) {
        this.status.LEFT_STICK_UP = 1;
      }
      if (this.status[i].LEFT_STICK_DOWN) {
        this.status.LEFT_STICK_DOWN = 1;
      }
      if (this.status[i].LEFT_STICK_LEFT) {
        this.status.LEFT_STICK_LEFT = 1;
      }
      if (this.status[i].LEFT_STICK_RIGHT) {
        this.status.LEFT_STICK_RIGHT = 1;
      }
      if (this.status[i].RIGHT_STICK_UP) {
        this.status.RIGHT_STICK_UP = 1;
      }
      if (this.status[i].RIGHT_STICK_DOWN) {
        this.status.RIGHT_STICK_DOWN = 1;
      }
      if (this.status[i].RIGHT_STICK_LEFT) {
        this.status.RIGHT_STICK_LEFT = 1;
      }
      if (this.status[i].RIGHT_STICK_RIGHT) {
        this.status.RIGHT_STICK_RIGHT = 1;
      }
      if (this.status[i].LT) {
        this.status.LT = this.status[i].LT;
      }
      if (this.status[i].RT) {
        this.status.RT = this.status[i].RT;
      }
      if (this.status[i].LEFT_STICK_AMOUNT > this.status.LEFT_STICK_AMOUNT) {
        this.status.LEFT_STICK_AMOUNT = this.status[i].LEFT_STICK_AMOUNT;
        this.status.LEFT_STICK_ANGLE = this.status[i].LEFT_STICK_ANGLE;
      }
      if (this.status[i].RIGHT_STICK_AMOUNT > this.status.RIGHT_STICK_AMOUNT) {
        this.status.RIGHT_STICK_AMOUNT = this.status[i].RIGHT_STICK_AMOUNT;
        this.status.RIGHT_STICK_ANGLE = this.status[i].RIGHT_STICK_ANGLE;
      }
    }
    for (i = n = ref5 = pad_count; n <= 3; i = n += 1) {
      delete this.status[i];
    }
    this.count = pad_count;
    this.updateChanges(this.status, this.previous.global);
    for (i = o = 0, ref6 = pad_count - 1; o <= ref6; i = o += 1) {
      this.updateChanges(this.status[i], this.previous[i]);
    }
  };

  Gamepad.prototype.updateChanges = function(current, previous) {
    var key;
    for (key in current.press) {
      current.press[key] = 0;
    }
    for (key in current.release) {
      current.release[key] = 0;
    }
    for (key in previous) {
      if (previous[key] && !current[key]) {
        current.release[key] = 1;
      }
    }
    for (key in current) {
      if (key === "press" || key === "release") {
        continue;
      }
      if (current[key] && !previous[key]) {
        current.press[key] = 1;
      }
    }
    for (key in previous) {
      previous[key] = 0;
    }
    for (key in current) {
      if (key === "press" || key === "release") {
        continue;
      }
      previous[key] = current[key];
    }
  };

  return Gamepad;

})();

this.Sprite = (function() {
  function Sprite(width, height1, properties) {
    var img;
    this.width = width;
    this.height = height1;
    this.name = "";
    this.frames = [];
    if ((this.width != null) && typeof this.width === "string") {
      this.ready = false;
      img = new Image;
      if (location.protocol !== "file:") {
        img.crossOrigin = "Anonymous";
      }
      img.src = this.width;
      this.width = 0;
      this.height = 0;
      img.onload = (function(_this) {
        return function() {
          _this.ready = true;
          return _this.load(img, properties);
        };
      })(this);
      img.onerror = (function(_this) {
        return function() {
          return _this.ready = true;
        };
      })(this);
    } else {
      this.frames.push(new SpriteFrame(this, this.width, this.height));
      this.ready = true;
    }
    this.current_frame = 0;
    this.animation_start = 0;
    this.fps = properties ? properties.fps || 5 : 5;
  }

  Sprite.prototype.setFrame = function(f) {
    return this.animation_start = Date.now() - 1000 / this.fps * f;
  };

  Sprite.prototype.getFrame = function() {
    var dt;
    dt = 1000 / this.fps;
    return Math.floor((Date.now() - this.animation_start) / dt) % this.frames.length;
  };

  Sprite.prototype.cutFrames = function(num) {
    var frame, height, i, j, ref;
    height = Math.round(this.height / num);
    for (i = j = 0, ref = num - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      frame = new Sprite(this.width, height);
      frame.getContext().drawImage(this.getCanvas(), 0, -i * height);
      this.frames[i] = frame;
    }
    this.height = height;
    return this.canvas = this.frames[0].canvas;
  };

  Sprite.prototype.saveData = function() {
    var canvas, context, i, j, ref;
    if (this.frames.length > 1) {
      canvas = document.createElement("canvas");
      canvas.width = this.width;
      canvas.height = this.height * this.frames.length;
      context = canvas.getContext("2d");
      for (i = j = 0, ref = this.frames.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        context.drawImage(this.frames[i].getCanvas(), 0, this.height * i);
      }
      return canvas.toDataURL();
    } else {
      return this.frames[0].getCanvas().toDataURL();
    }
  };

  Sprite.prototype.loaded = function() {};

  Sprite.prototype.setCurrentFrame = function(index) {
    if (index >= 0 && index < this.frames.length) {
      return this.current_frame = index;
    }
  };

  Sprite.prototype.clone = function() {
    var sprite;
    sprite = new Sprite(this.width, this.height);
    sprite.copyFrom(this);
    return sprite;
  };

  Sprite.prototype.resize = function(width, height1) {
    var f, j, len, ref;
    this.width = width;
    this.height = height1;
    ref = this.frames;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      f.resize(this.width, this.height);
    }
  };

  Sprite.prototype.load = function(img, properties) {
    var frame, i, j, numframes, ref;
    if (img.width > 0 && img.height > 0) {
      numframes = 1;
      if ((properties != null) && (properties.frames != null)) {
        numframes = properties.frames;
      }
      this.width = img.width;
      this.height = Math.round(img.height / numframes);
      this.frames = [];
      for (i = j = 0, ref = numframes - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        frame = new SpriteFrame(this, this.width, this.height);
        frame.getContext().drawImage(img, 0, -i * this.height);
        this.frames.push(frame);
      }
      this.ready = true;
    }
    return this.loaded();
  };

  Sprite.prototype.copyFrom = function(sprite) {
    var f, j, len, ref;
    this.width = sprite.width;
    this.height = sprite.height;
    this.frames = [];
    ref = sprite.frames;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      this.frames.push(f.clone());
    }
    this.current_frame = sprite.current_frame;
  };

  Sprite.prototype.clear = function() {
    var f, j, len, ref;
    ref = this.frames;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      f.clear();
    }
  };

  Sprite.prototype.addFrame = function() {
    return this.frames.push(new SpriteFrame(this, this.width, this.height));
  };

  Sprite.prototype.flipH = function() {
    var cc, data, f, j, k, l, len, oc, ref, ref1, ref2, xx, yy;
    ref = this.frames;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      cc = f.clone().getContext();
      oc = f.getContext();
      for (xx = k = 0, ref1 = f.width - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; xx = 0 <= ref1 ? ++k : --k) {
        for (yy = l = 0, ref2 = f.height - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; yy = 0 <= ref2 ? ++l : --l) {
          data = cc.getImageData(xx, yy, 1, 1);
          oc.putImageData(data, f.width - xx - 1, yy);
        }
      }
    }
  };

  Sprite.prototype.flipV = function() {
    var cc, data, f, j, k, l, len, oc, ref, ref1, ref2, xx, yy;
    ref = this.frames;
    for (j = 0, len = ref.length; j < len; j++) {
      f = ref[j];
      cc = f.clone().getContext();
      oc = f.getContext();
      for (xx = k = 0, ref1 = f.width - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; xx = 0 <= ref1 ? ++k : --k) {
        for (yy = l = 0, ref2 = f.height - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; yy = 0 <= ref2 ? ++l : --l) {
          data = cc.getImageData(xx, yy, 1, 1);
          oc.putImageData(data, xx, f.height - yy - 1);
        }
      }
    }
  };

  return Sprite;

})();

this.SpriteFrame = (function() {
  function SpriteFrame(sprite, width, height) {
    this.sprite = sprite;
    this.width = width;
    this.height = height;
    this.name = "";
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  SpriteFrame.prototype.clone = function() {
    var sf;
    sf = new SpriteFrame(this.sprite, this.width, this.height);
    sf.getContext().drawImage(this.canvas, 0, 0);
    return sf;
  };

  SpriteFrame.prototype.getContext = function() {
    if (this.canvas == null) {
      return null;
    }
    return this.context = this.getCanvas().getContext("2d");
  };

  SpriteFrame.prototype.getCanvas = function() {
    var c;
    if (this.canvas == null) {
      return null;
    }
    if (!(this.canvas instanceof HTMLCanvasElement)) {
      c = document.createElement("canvas");
      c.width = this.canvas.width;
      c.height = this.canvas.height;
      c.getContext("2d").drawImage(this.canvas, 0, 0);
      this.canvas = c;
    }
    return this.canvas;
  };

  SpriteFrame.prototype.setPixel = function(x, y, color, alpha) {
    var c;
    if (alpha == null) {
      alpha = 1;
    }
    c = this.getContext();
    c.globalAlpha = alpha;
    c.fillStyle = color;
    c.fillRect(x, y, 1, 1);
    return c.globalAlpha = 1;
  };

  SpriteFrame.prototype.erasePixel = function(x, y, alpha) {
    var c, data;
    if (alpha == null) {
      alpha = 1;
    }
    c = this.getContext();
    data = c.getImageData(x, y, 1, 1);
    data.data[3] *= 1 - alpha;
    return c.putImageData(data, x, y);
  };

  SpriteFrame.prototype.getRGB = function(x, y) {
    var c, data;
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return [0, 0, 0];
    }
    c = this.getContext();
    data = c.getImageData(x, y, 1, 1);
    return data.data;
  };

  SpriteFrame.prototype.clear = function() {
    return this.getContext().clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  SpriteFrame.prototype.resize = function(w, h) {
    var c;
    if (w === this.width && h === this.height) {
      return;
    }
    c = new PixelArtScaler().rescale(this.canvas, w, h);
    this.canvas = c;
    this.context = null;
    this.width = w;
    return this.height = h;
  };

  SpriteFrame.prototype.load = function(img) {
    this.resize(img.width, img.height);
    this.clear();
    return this.canvas.getContext("2d").drawImage(img, 0, 0);
  };

  SpriteFrame.prototype.copyFrom = function(frame) {
    this.resize(frame.width, frame.height);
    this.clear();
    return this.getContext().drawImage(frame.canvas, 0, 0);
  };

  return SpriteFrame;

})();

this.MicroMap = (function() {
  function MicroMap(width, height, block_width, block_height, sprites1) {
    var req;
    this.width = width;
    this.height = height;
    this.block_width = block_width;
    this.block_height = block_height;
    this.sprites = sprites1;
    this.map = [];
    if ((this.width != null) && typeof this.width === "string") {
      this.ready = false;
      req = new XMLHttpRequest();
      req.onreadystatechange = (function(_this) {
        return function(event) {
          if (req.readyState === XMLHttpRequest.DONE) {
            _this.ready = true;
            if (req.status === 200) {
              _this.load(req.responseText, _this.sprites);
              _this.update();
            }
            if (_this.loaded != null) {
              return _this.loaded();
            }
          }
        };
      })(this);
      req.open("GET", this.width);
      req.send();
      this.width = 10;
      this.height = 10;
      this.block_width = 10;
      this.block_height = 10;
    } else {
      this.ready = true;
    }
    this.clear();
    this.update();
  }

  MicroMap.prototype.clear = function() {
    var i, j, k, l, ref1, ref2;
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        this.map[i + j * this.width] = null;
      }
    }
  };

  MicroMap.prototype.set = function(x, y, ref) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.map[x + y * this.width] = ref;
      return this.needs_update = true;
    }
  };

  MicroMap.prototype.get = function(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 0;
    }
    return this.map[x + y * this.width] || 0;
  };

  MicroMap.prototype.getCanvas = function() {
    if ((this.canvas == null) || this.needs_update) {
      this.update();
    }
    return this.canvas;
  };

  MicroMap.prototype.update = function() {
    var c, context, i, index, j, k, l, ref1, ref2, s, sprite, tx, ty, xy;
    this.needs_update = false;
    if (this.canvas == null) {
      this.canvas = document.createElement("canvas");
    }
    if (this.canvas.width !== this.width * this.block_width || this.canvas.height !== this.height * this.block_height) {
      this.canvas.width = this.width * this.block_width;
      this.canvas.height = this.height * this.block_height;
    }
    context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        index = i + (this.height - 1 - j) * this.width;
        s = this.map[index];
        if ((s != null) && s.length > 0) {
          s = s.split(":");
          sprite = this.sprites[s[0]];
          if ((sprite != null) && (sprite.frames[0] != null)) {
            if (s[1] != null) {
              xy = s[1].split(",");
              tx = xy[0] * this.block_width;
              ty = xy[1] * this.block_height;
              c = sprite.frames[0].canvas;
              if ((c != null) && c.width > 0 && c.height > 0) {
                context.drawImage(c, tx, ty, this.block_width, this.block_height, this.block_width * i, this.block_height * j, this.block_width, this.block_height);
              }
            } else {
              c = sprite.frames[0].canvas;
              if ((c != null) && c.width > 0 && c.height > 0) {
                context.drawImage(c, this.block_width * i, this.block_height * j);
              }
            }
          }
        }
      }
    }
  };

  MicroMap.prototype.resize = function(w, h, block_width, block_height) {
    var i, j, k, l, map, ref1, ref2;
    this.block_width = block_width != null ? block_width : this.block_width;
    this.block_height = block_height != null ? block_height : this.block_height;
    map = [];
    for (j = k = 0, ref1 = h - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = w - 1; l <= ref2; i = l += 1) {
        if (j < this.height && i < this.width) {
          map[i + j * w] = this.map[i + j * this.width];
        } else {
          map[i + j * w] = null;
        }
      }
    }
    this.map = map;
    this.width = w;
    return this.height = h;
  };

  MicroMap.prototype.save = function() {
    var data, i, index, j, k, l, list, m, map, n, ref1, ref2, ref3, ref4, s, table;
    index = 1;
    list = [0];
    table = {};
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        s = this.map[i + j * this.width];
        if ((s != null) && s.length > 0 && (table[s] == null)) {
          list.push(s);
          table[s] = index++;
        }
      }
    }
    map = [];
    for (j = m = 0, ref3 = this.height - 1; m <= ref3; j = m += 1) {
      for (i = n = 0, ref4 = this.width - 1; n <= ref4; i = n += 1) {
        s = this.map[i + j * this.width];
        map[i + j * this.width] = (s != null) && s.length > 0 ? table[s] : 0;
      }
    }
    data = {
      width: this.width,
      height: this.height,
      block_width: this.block_width,
      block_height: this.block_height,
      sprites: list,
      data: map
    };
    return JSON.stringify(data);
  };

  MicroMap.prototype.loadFile = function(url) {
    var req;
    req = new XMLHttpRequest();
    req.onreadystatechange = (function(_this) {
      return function(event) {
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            _this.load(req.responseText, _this.sprites);
            return _this.update();
          }
        }
      };
    })(this);
    req.open("GET", url);
    return req.send();
  };

  MicroMap.prototype.load = function(data, sprites) {
    var i, j, k, l, ref1, ref2, s;
    data = JSON.parse(data);
    this.width = data.width;
    this.height = data.height;
    this.block_width = data.block_width;
    this.block_height = data.block_height;
    for (j = k = 0, ref1 = data.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = data.width - 1; l <= ref2; i = l += 1) {
        s = data.data[i + j * data.width];
        if (s > 0) {
          this.map[i + j * data.width] = data.sprites[s];
        } else {
          this.map[i + j * data.width] = null;
        }
      }
    }
  };

  MicroMap.loadMap = function(data, sprites) {
    var i, j, k, l, map, ref1, ref2, s;
    data = JSON.parse(data);
    map = new MicroMap(data.width, data.height, data.block_width, data.block_height, sprites);
    for (j = k = 0, ref1 = data.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = data.width - 1; l <= ref2; i = l += 1) {
        s = data.data[i + j * data.width];
        if (s > 0) {
          map.map[i + j * data.width] = data.sprites[s];
        }
      }
    }
    return map;
  };

  MicroMap.prototype.clone = function() {
    var i, j, k, l, map, ref1, ref2;
    map = new MicroMap(this.width, this.height, this.block_width, this.block_height, this.sprites);
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        map.map[i + j * this.width] = this.map[i + j * this.width];
      }
    }
    map.needs_update = true;
    return map;
  };

  MicroMap.prototype.copyFrom = function(map) {
    var i, j, k, l, ref1, ref2;
    this.width = map.width;
    this.height = map.height;
    this.block_width = map.block_width;
    this.block_height = map.block_height;
    for (j = k = 0, ref1 = this.height - 1; k <= ref1; j = k += 1) {
      for (i = l = 0, ref2 = this.width - 1; l <= ref2; i = l += 1) {
        this.map[i + j * this.width] = map.map[i + j * this.width];
      }
    }
    this.update();
    return this;
  };

  return MicroMap;

})();

this.AudioCore = (function() {
  function AudioCore(runtime) {
    this.runtime = runtime;
    this.buffer = [];
    this.getContext();
    this.playing = [];
    this.wakeup_list = [];
  }

  AudioCore.prototype.isStarted = function() {
    return this.context.state === "running";
  };

  AudioCore.prototype.addToWakeUpList = function(item) {
    return this.wakeup_list.push(item);
  };

  AudioCore.prototype.getInterface = function() {
    var audio;
    audio = this;
    return this["interface"] = {
      beep: function(sequence) {
        return audio.beep(sequence);
      },
      cancelBeeps: function() {
        return audio.cancelBeeps();
      },
      playSound: function(sound, volume, pitch, pan, loopit) {
        return audio.playSound(sound, volume, pitch, pan, loopit);
      },
      playMusic: function(music, volume, loopit) {
        return audio.playMusic(music, volume, loopit);
      }
    };
  };

  AudioCore.prototype.playSound = function(sound, volume, pitch, pan, loopit) {
    var s;
    if (volume == null) {
      volume = 1;
    }
    if (pitch == null) {
      pitch = 1;
    }
    if (pan == null) {
      pan = 0;
    }
    if (loopit == null) {
      loopit = 0;
    }
    if (typeof sound === "string") {
      s = this.runtime.sounds[sound.replace(/\//g, "-")];
      if (s != null) {
        return s.play(volume, pitch, pan, loopit);
      }
    }
    return 0;
  };

  AudioCore.prototype.playMusic = function(music, volume, loopit) {
    var m;
    if (volume == null) {
      volume = 1;
    }
    if (loopit == null) {
      loopit = 0;
    }
    if (typeof music === "string") {
      m = this.runtime.music[music.replace(/\//g, "-")];
      if (m != null) {
        return m.play(volume, loopit);
      }
    }
    return 0;
  };

  AudioCore.prototype.start = function() {
    var blob, src;
    if (false) {
      blob = new Blob([AudioCore.processor], {
        type: "text/javascript"
      });
      return this.context.audioWorklet.addModule(window.URL.createObjectURL(blob)).then((function(_this) {
        return function() {
          _this.node = new AudioWorkletNode(_this.context, "my-worklet-processor");
          _this.node.connect(_this.context.destination);
          return _this.flushBuffer();
        };
      })(this));
    } else {
      this.script_processor = this.context.createScriptProcessor(4096, 2, 2);
      this.processor_funk = (function(_this) {
        return function(event) {
          return _this.onAudioProcess(event);
        };
      })(this);
      this.script_processor.onaudioprocess = this.processor_funk;
      this.script_processor.connect(this.context.destination);
      src = "class AudioWorkletProcessor {\n  constructor() {\n    this.port = {} ;\n\n    var _this = this ;\n\n    this.port.postMessage = function(data) {\n      var event = { data: data } ;\n      _this.port.onmessage(event) ;\n    }\n  }\n\n} ;\nregisterProcessor = function(a,b) {\n  return new MyWorkletProcessor()\n} ;\n";
      src += AudioCore.processor;
      this.node = eval(src);
      this.flushBuffer();
      return this.bufferizer = new AudioBufferizer(this.node);
    }
  };

  AudioCore.prototype.flushBuffer = function() {
    var results;
    results = [];
    while (this.buffer.length > 0) {
      results.push(this.node.port.postMessage(this.buffer.splice(0, 1)[0]));
    }
    return results;
  };

  AudioCore.prototype.onAudioProcess = function(event) {
    var left, outputs, right;
    left = event.outputBuffer.getChannelData(0);
    right = event.outputBuffer.getChannelData(1);
    outputs = [[left, right]];
    this.bufferizer.flush(outputs);
  };

  AudioCore.prototype.getContext = function() {
    var activate;
    if (this.context == null) {
      this.context = new (window.AudioContext || window.webkitAudioContext);
      if (this.context.state !== "running") {
        activate = (function(_this) {
          return function() {
            var item, j, len, ref;
            console.info("resuming context");
            _this.context.resume();
            if (_this.beeper != null) {
              _this.start();
            }
            ref = _this.wakeup_list;
            for (j = 0, len = ref.length; j < len; j++) {
              item = ref[j];
              item.wakeUp();
            }
            document.body.removeEventListener("touchend", activate);
            return document.body.removeEventListener("mouseup", activate);
          };
        })(this);
        document.body.addEventListener("touchend", activate);
        document.body.addEventListener("mouseup", activate);
      } else if (this.beeper != null) {
        this.start();
      }
    }
    return this.context;
  };

  AudioCore.prototype.getBeeper = function() {
    if (this.beeper == null) {
      this.beeper = new Beeper(this);
      if (this.context.state === "running") {
        this.start();
      }
    }
    return this.beeper;
  };

  AudioCore.prototype.beep = function(sequence) {
    return this.getBeeper().beep(sequence);
  };

  AudioCore.prototype.addBeeps = function(beeps) {
    var b, j, len;
    for (j = 0, len = beeps.length; j < len; j++) {
      b = beeps[j];
      b.duration *= this.context.sampleRate;
      b.increment = b.frequency / this.context.sampleRate;
    }
    if (this.node != null) {
      return this.node.port.postMessage(JSON.stringify({
        name: "beep",
        sequence: beeps
      }));
    } else {
      return this.buffer.push(JSON.stringify({
        name: "beep",
        sequence: beeps
      }));
    }
  };

  AudioCore.prototype.cancelBeeps = function() {
    if (this.node != null) {
      this.node.port.postMessage(JSON.stringify({
        name: "cancel_beeps"
      }));
    } else {
      this.buffer.push(JSON.stringify({
        name: "cancel_beeps"
      }));
    }
    return this.stopAll();
  };

  AudioCore.prototype.addPlaying = function(item) {
    return this.playing.push(item);
  };

  AudioCore.prototype.removePlaying = function(item) {
    var index;
    index = this.playing.indexOf(item);
    if (index >= 0) {
      return this.playing.splice(index, 1);
    }
  };

  AudioCore.prototype.stopAll = function() {
    var err, j, len, p, ref;
    ref = this.playing;
    for (j = 0, len = ref.length; j < len; j++) {
      p = ref[j];
      try {
        p.stop();
      } catch (error) {
        err = error;
        console.error(err);
      }
    }
    return this.playing = [];
  };

  AudioCore.processor = "class MyWorkletProcessor extends AudioWorkletProcessor {\n  constructor() {\n    super();\n    this.beeps = [] ;\n    this.last = 0 ;\n    this.port.onmessage = (event) => {\n      let data = JSON.parse(event.data) ;\n      if (data.name == \"cancel_beeps\")\n      {\n        this.beeps = [] ;\n      }\n      else if (data.name == \"beep\")\n      {\n        let seq = data.sequence ;\n        for (let i=0;i<seq.length;i++)\n        {\n          let note = seq[i] ;\n          if (i>0)\n          {\n            seq[i-1].next = note ;\n          }\n\n          if (note.loopto != null)\n          {\n            note.loopto = seq[note.loopto] ;\n          }\n\n          note.phase = 0 ;\n          note.time = 0 ;\n        }\n\n        this.beeps.push(seq[0]) ;\n      }\n    } ;\n  }\n\n  process(inputs, outputs, parameters) {\n    var output = outputs[0] ;\n    var phase ;\n    for (var i=0;i<output.length;i++)\n    {\n      var channel = output[i] ;\n      if (i>0)\n      {\n        for (var j=0;j<channel.length;j++)\n        {\n          channel[j] = output[0][j]\n        }\n      }\n      else\n      {\n        for (var j=0;j<channel.length;j++)\n        {\n          let sig = 0 ;\n          for (var k=this.beeps.length-1;k>=0;k--)\n          {\n            let b = this.beeps[k];\n            let volume = b.volume ;\n            if (b.time/b.duration>b.span)\n              {\n                volume = 0 ;\n              }\n            if (b.waveform == \"square\")\n            {\n              sig += b.phase>.5? volume : -volume ;\n            }\n            else if (b.waveform == \"saw\")\n            {\n              sig += (b.phase*2-1)*volume ;\n            }\n            else if (b.waveform == \"noise\")\n            {\n              sig += (Math.random()*2-1)*volume ;\n            }\n            else\n            {\n              sig += Math.sin(b.phase*Math.PI*2)*volume ;\n            }\n\n            b.phase = (b.phase+b.increment)%1 ;\n            b.time += 1 ;\n            if (b.time>=b.duration)\n            {\n              b.time = 0 ;\n              if (b.loopto != null)\n              {\n                if (b.repeats != null && b.repeats>0)\n                {\n                  if (b.loopcount == null)\n                  {\n                    b.loopcount = 0 ;\n                  }\n                  b.loopcount++ ;\n                  if (b.loopcount>=b.repeats)\n                  {\n                    b.loopcount = 0 ;\n                    if (b.next != null)\n                    {\n                      b.next.phase = b.phase ;\n                      b = b.next ;\n                      this.beeps[k] = b ;\n                    }\n                    else\n                    {\n                      this.beeps.splice(k,1) ;\n                    }\n                  }\n                  else\n                  {\n                    b.loopto.phase = b.phase ;\n                    b = b.loopto ;\n                    this.beeps[k] = b ;\n                  }\n                }\n                else\n                {\n                  b.loopto.phase = b.phase ;\n                  b = b.loopto ;\n                  this.beeps[k] = b ;\n                }\n              }\n              else if (b.next != null)\n              {\n                b.next.phase = b.phase ;\n                b = b.next ;\n                this.beeps[k] = b ;\n              }\n              else\n              {\n                this.beeps.splice(k,1) ;\n              }\n            }\n          }\n          this.last = this.last*.9+sig*.1 ;\n          channel[j] = this.last ;\n        }\n      }\n    }\n    return true ;\n  }\n}\n\nregisterProcessor('my-worklet-processor', MyWorkletProcessor);";

  return AudioCore;

})();

this.AudioBufferizer = (function() {
  function AudioBufferizer(node) {
    var i, j, k, left, ref, right;
    this.node = node;
    this.buffer_size = 4096;
    this.chunk_size = 512;
    this.chunks = [];
    this.nb_chunks = this.buffer_size / this.chunk_size;
    for (i = j = 0, ref = this.nb_chunks - 1; j <= ref; i = j += 1) {
      left = (function() {
        var n, ref1, results;
        results = [];
        for (k = n = 0, ref1 = this.chunk_size - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
          results.push(0);
        }
        return results;
      }).call(this);
      right = (function() {
        var n, ref1, results;
        results = [];
        for (k = n = 0, ref1 = this.chunk_size - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
          results.push(0);
        }
        return results;
      }).call(this);
      this.chunks[i] = [[left, right]];
    }
    this.current = 0;
    setInterval(((function(_this) {
      return function() {
        return _this.step();
      };
    })(this)), this.chunk_size / 44100 * 1000);
  }

  AudioBufferizer.prototype.step = function() {
    if (this.current >= this.chunks.length) {
      return;
    }
    this.node.process(null, this.chunks[this.current], null);
    this.current++;
  };

  AudioBufferizer.prototype.flush = function(outputs) {
    var chunk, i, index, j, k, l, left, n, r, ref, ref1, right;
    while (this.current < this.chunks.length) {
      this.step();
    }
    this.current = 0;
    left = outputs[0][0];
    right = outputs[0][1];
    index = 0;
    chunk = 0;
    for (i = j = 0, ref = this.chunks.length - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
      chunk = this.chunks[i];
      l = chunk[0][0];
      r = chunk[0][1];
      for (k = n = 0, ref1 = l.length - 1; 0 <= ref1 ? n <= ref1 : n >= ref1; k = 0 <= ref1 ? ++n : --n) {
        left[index] = l[k];
        right[index] = r[k];
        index += 1;
      }
    }
  };

  return AudioBufferizer;

})();

this.Beeper = (function() {
  function Beeper(audio) {
    var i, j, k, l, len, len1, n, oct, ref, ref1, text;
    this.audio = audio;
    this.notes = {};
    this.plain_notes = {};
    text = [["C", "DO"], ["C#", "DO#", "Db", "REb"], ["D", "RE"], ["D#", "RE#", "Eb", "MIb"], ["E", "MI"], ["F", "FA"], ["F#", "FA#", "Gb", "SOLb"], ["G", "SOL"], ["G#", "SOL#", "Ab", "LAb"], ["A", "LA"], ["A#", "LA#", "Bb", "SIb"], ["B", "SI"]];
    for (i = j = 0; j <= 127; i = j += 1) {
      this.notes[i] = i;
      oct = Math.floor(i / 12) - 1;
      ref = text[i % 12];
      for (k = 0, len = ref.length; k < len; k++) {
        n = ref[k];
        this.notes[n + oct] = i;
      }
      if (oct === -1) {
        ref1 = text[i % 12];
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          n = ref1[l];
          this.plain_notes[n] = i;
        }
      }
    }
    this.current_octave = 5;
    this.current_duration = .5;
    this.current_volume = .5;
    this.current_span = 1;
    this.current_waveform = "square";
  }

  Beeper.prototype.beep = function(input) {
    var i, j, k, len, loops, lop, n, note, parsed, ref, ref1, sequence, status, t, test;
    test = "loop 0 square tempo 120 duration 500 volume 50 span 50 DO2 DO - FA SOL SOL FA -";
    status = "normal";
    sequence = [];
    loops = [];
    parsed = input.split(" ");
    for (j = 0, len = parsed.length; j < len; j++) {
      t = parsed[j];
      if (t === "") {
        continue;
      }
      switch (status) {
        case "normal":
          if (this.notes[t] != null) {
            note = this.notes[t];
            this.current_octave = Math.floor(note / 12);
            sequence.push({
              frequency: 440 * Math.pow(Math.pow(2, 1 / 12), note - 69),
              volume: this.current_volume,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (this.plain_notes[t] != null) {
            note = this.plain_notes[t] + this.current_octave * 12;
            sequence.push({
              frequency: 440 * Math.pow(Math.pow(2, 1 / 12), note - 69),
              volume: this.current_volume,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (t === "square" || t === "sine" || t === "saw" || t === "noise") {
            this.current_waveform = t;
          } else if (t === "tempo" || t === "duration" || t === "volume" || t === "span" || t === "loop" || t === "to") {
            status = t;
          } else if (t === "-") {
            sequence.push({
              frequency: 440,
              volume: 0,
              span: this.current_span,
              duration: this.current_duration,
              waveform: this.current_waveform
            });
          } else if (t === "end") {
            if (loops.length > 0 && sequence.length > 0) {
              sequence.push({
                frequency: 440,
                volume: 0,
                span: this.current_span,
                duration: 0,
                waveform: this.current_waveform
              });
              lop = loops.splice(loops.length - 1, 1)[0];
              sequence[sequence.length - 1].loopto = lop.start;
              sequence[sequence.length - 1].repeats = lop.repeats;
            }
          }
          break;
        case "tempo":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t) && t > 0) {
            this.current_duration = 60 / t;
          }
          break;
        case "duration":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t) && t > 0) {
            this.current_duration = t / 1000;
          }
          break;
        case "volume":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            this.current_volume = t / 100;
          }
          break;
        case "span":
          status = "normal";
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            this.current_span = t / 100;
          }
          break;
        case "loop":
          status = "normal";
          loops.push({
            start: sequence.length
          });
          t = Number.parseFloat(t);
          if (!Number.isNaN(t)) {
            loops[loops.length - 1].repeats = t;
          }
          break;
        case "to":
          status = "normal";
          if (note != null) {
            n = null;
            if (this.notes[t] != null) {
              n = this.notes[t];
            } else if (this.plain_notes[t] != null) {
              n = this.plain_notes[t] + this.current_octave * 12;
            }
            if ((n != null) && n !== note) {
              for (i = k = ref = note, ref1 = n; ref <= ref1 ? k <= ref1 : k >= ref1; i = ref <= ref1 ? ++k : --k) {
                if (i !== note) {
                  sequence.push({
                    frequency: 440 * Math.pow(Math.pow(2, 1 / 12), i - 69),
                    volume: this.current_volume,
                    span: this.current_span,
                    duration: this.current_duration,
                    waveform: this.current_waveform
                  });
                }
              }
              note = n;
            }
          }
      }
    }
    if (loops.length > 0 && sequence.length > 0) {
      lop = loops.splice(loops.length - 1, 1)[0];
      sequence.push({
        frequency: 440,
        volume: 0,
        span: this.current_span,
        duration: 0,
        waveform: this.current_waveform
      });
      sequence[sequence.length - 1].loopto = lop.start;
      sequence[sequence.length - 1].repeats = lop.repeats;
    }
    return this.audio.addBeeps(sequence);
  };

  return Beeper;

})();

this.Sound = (function() {
  function Sound(audio, url) {
    var request;
    this.audio = audio;
    this.url = url;
    request = new XMLHttpRequest();
    request.open('GET', this.url, true);
    request.responseType = 'arraybuffer';
    request.onload = (function(_this) {
      return function() {
        return _this.audio.context.decodeAudioData(request.response, function(buffer) {
          _this.buffer = buffer;
        });
      };
    })(this);
    request.send();
  }

  Sound.prototype.play = function(volume, pitch, pan, loopit) {
    var gain, panner, playing, res, source;
    if (volume == null) {
      volume = 1;
    }
    if (pitch == null) {
      pitch = 1;
    }
    if (pan == null) {
      pan = 0;
    }
    if (loopit == null) {
      loopit = false;
    }
    if (this.buffer == null) {
      return;
    }
    source = this.audio.context.createBufferSource();
    source.playbackRate.value = pitch;
    source.buffer = this.buffer;
    if (loopit) {
      source.loop = true;
    }
    gain = this.audio.context.createGain();
    gain.gain.value = volume;
    if (false && (this.audio.context.createStereoPanner != null)) {
      panner = this.audio.context.createStereoPanner();
      panner.setPan = function(pan) {
        return panner.pan.value = pan;
      };
    } else {
      panner = this.audio.context.createPanner();
      panner.panningModel = "equalpower";
      panner.setPan = function(pan) {
        return panner.setPosition(pan, 0, 1 - Math.abs(pan));
      };
    }
    panner.setPan(pan);
    source.connect(gain);
    gain.connect(panner);
    panner.connect(this.audio.context.destination);
    source.start();
    playing = null;
    if (loopit) {
      playing = {
        stop: (function(_this) {
          return function() {
            return source.stop();
          };
        })(this)
      };
      this.audio.addPlaying(playing);
    }
    res = {
      stop: function() {
        source.stop();
        if (playing) {
          return this.audio.removePlaying(playing);
        }
      },
      setVolume: function(volume) {
        return gain.gain.value = Math.max(0, Math.min(1, volume));
      },
      setPitch: function(pitch) {
        return source.playbackRate.value = Math.max(.001, Math.min(1000, pitch));
      },
      setPan: function(pan) {
        return panner.setPan(Math.max(-1, Math.min(1, pan)));
      },
      finished: false
    };
    source.onended = function() {
      return res.finished = true;
    };
    return res;
  };

  return Sound;

})();

this.Music = (function() {
  function Music(audio, url) {
    this.audio = audio;
    this.url = url;
    this.tag = new Audio(this.url);
    this.playing = false;
  }

  Music.prototype.play = function(volume, loopit) {
    if (volume == null) {
      volume = 1;
    }
    if (loopit == null) {
      loopit = false;
    }
    this.playing = true;
    this.tag.loop = loopit ? true : false;
    if (this.audio.isStarted()) {
      this.tag.play();
    } else {
      this.audio.addToWakeUpList(this);
    }
    this.audio.addPlaying(this);
    return {
      play: (function(_this) {
        return function() {
          return _this.tag.play();
        };
      })(this),
      stop: (function(_this) {
        return function() {
          _this.playing = false;
          _this.tag.pause();
          return _this.audio.removePlaying(_this);
        };
      })(this),
      setVolume: (function(_this) {
        return function(volume) {
          return _this.tag.volume = Math.max(0, Math.min(1, volume));
        };
      })(this),
      getPosition: (function(_this) {
        return function() {
          return _this.tag.currentTime;
        };
      })(this),
      getDuration: (function(_this) {
        return function() {
          return _this.tag.duration;
        };
      })(this),
      setPosition: (function(_this) {
        return function(pos) {
          _this.tag.pause();
          _this.tag.currentTime = Math.max(0, Math.min(_this.tag.duration, pos));
          if (_this.playing) {
            return _this.tag.play();
          }
        };
      })(this)
    };
  };

  Music.prototype.wakeUp = function() {
    if (this.playing) {
      return this.tag.play();
    }
  };

  Music.prototype.stop = function() {
    this.playing = false;
    return this.tag.pause();
  };

  return Music;

})();

this.Player = (function() {
  function Player() {
    var i, len, ref, source;
    this.source_count = 0;
    this.sources = {};
    this.resources = resources;
    if (resources.sources != null) {
      ref = resources.sources;
      for (i = 0, len = ref.length; i < len; i++) {
        source = ref[i];
        this.loadSource(source);
      }
    } else {
      this.sources.main = document.getElementById("code").innerText;
      this.start();
    }
  }

  Player.prototype.loadSource = function(source) {
    var req;
    req = new XMLHttpRequest();
    req.onreadystatechange = (function(_this) {
      return function(event) {
        var name;
        if (req.readyState === XMLHttpRequest.DONE) {
          if (req.status === 200) {
            name = source.file.split(".")[0];
            _this.sources[name] = req.responseText;
            _this.source_count++;
            if (_this.source_count >= resources.sources.length && (_this.runtime == null)) {
              return _this.start();
            }
          }
        }
      };
    })(this);
    req.open("GET", location.origin + location.pathname + ("ms/" + source.file + "?v=" + source.version));
    return req.send();
  };

  Player.prototype.start = function() {
    var touchListener, touchStartListener, wrapper;
    this.runtime = new Runtime((window.exported_project ? "" : location.origin + location.pathname), this.sources, resources, this);
    this.client = new PlayerClient(this);
    wrapper = document.getElementById("canvaswrapper");
    wrapper.appendChild(this.runtime.screen.canvas);
    window.addEventListener("resize", (function(_this) {
      return function() {
        return _this.resize();
      };
    })(this));
    this.resize();
    touchStartListener = (function(_this) {
      return function(event) {
        event.preventDefault();
        _this.runtime.screen.canvas.removeEventListener("touchstart", touchStartListener);
        return true;
      };
    })(this);
    touchListener = (function(_this) {
      return function(event) {
        _this.setFullScreen();
        return true;
      };
    })(this);
    this.runtime.screen.canvas.addEventListener("touchstart", touchStartListener);
    this.runtime.screen.canvas.addEventListener("touchend", touchListener);
    this.runtime.start();
    window.addEventListener("message", (function(_this) {
      return function(msg) {
        return _this.messageReceived(msg);
      };
    })(this));
    return this.postMessage({
      name: "focus"
    });
  };

  Player.prototype.resize = function() {
    var file, ref, results, src;
    this.runtime.screen.resize();
    if (this.runtime.vm != null) {
      if (this.runtime.vm.context.global.draw == null) {
        this.runtime.update_memory = {};
        ref = this.runtime.sources;
        results = [];
        for (file in ref) {
          src = ref[file];
          results.push(this.runtime.updateSource(file, src, false));
        }
        return results;
      }
    }
  };

  Player.prototype.setFullScreen = function() {
    var ref;
    if ((document.documentElement.webkitRequestFullScreen != null) && !document.webkitIsFullScreen) {
      document.documentElement.webkitRequestFullScreen();
    } else if ((document.documentElement.requestFullScreen != null) && !document.fullScreen) {
      document.documentElement.requestFullScreen();
    } else if ((document.documentElement.mozRequestFullScreen != null) && !document.mozFullScreen) {
      document.documentElement.mozRequestFullScreen();
    }
    if ((window.screen != null) && (window.screen.orientation != null) && ((ref = window.orientation) === "portrait" || ref === "landscape")) {
      return window.screen.orientation.lock(window.orientation).then(null, function(error) {});
    }
  };

  Player.prototype.reportError = function(err) {
    return this.postMessage({
      name: "error",
      data: err
    });
  };

  Player.prototype.log = function(text) {
    return this.postMessage({
      name: "log",
      data: text
    });
  };

  Player.prototype.messageReceived = function(msg) {
    var code, data, err, file, res;
    data = msg.data;
    try {
      data = JSON.parse(data);
      switch (data.name) {
        case "command":
          res = this.runtime.runCommand(data.line);
          if (!data.line.trim().startsWith("print")) {
            return this.postMessage({
              name: "output",
              data: res,
              id: data.id
            });
          }
          break;
        case "pause":
          return this.runtime.stop();
        case "resume":
          return this.runtime.resume();
        case "code_updated":
          code = data.code;
          file = data.file.split(".")[0];
          if (this.runtime.vm != null) {
            this.runtime.vm.clearWarnings();
          }
          return this.runtime.updateSource(file, code, true);
        case "sprite_updated":
          file = data.file;
          return this.runtime.updateSprite(file, 0, data.data, data.properties);
        case "map_updated":
          file = data.file;
          return this.runtime.updateMap(file, 0, data.data);
        case "take_picture":
          this.runtime.screen.takePicture((function(_this) {
            return function(pic) {
              return _this.postMessage({
                name: "picture_taken",
                data: pic
              });
            };
          })(this));
          if (this.runtime.stopped) {
            return this.runtime.drawCall();
          }
      }
    } catch (error1) {
      err = error1;
      return console.error(err);
    }
  };

  Player.prototype.postMessage = function(data) {
    if (window !== window.parent) {
      return window.parent.postMessage(JSON.stringify(data), "*");
    }
  };

  return Player;

})();

window.addEventListener("load", function() {
  window.player = new Player();
  return document.body.focus();
});

if ((navigator.serviceWorker != null) && !window.skip_service_worker) {
  navigator.serviceWorker.register('sw.js', {
    scope: location.pathname
  }).then(function(reg) {
    return console.log('Registration succeeded. Scope is' + reg.scope);
  })["catch"](function(error) {
    return console.log('Registration failed with' + error);
  });
}

this.PlayerClient = (function() {
  function PlayerClient(player) {
    var err;
    this.player = player;
    this.pending_requests = {};
    this.request_id = 0;
    this.version_checked = false;
    this.reconnect_delay = 1000;
    if (location.protocol.startsWith("http")) {
      try {
        this.connect();
      } catch (error) {
        err = error;
        console.error(err);
      }
      setInterval(((function(_this) {
        return function() {
          if (_this.socket != null) {
            return _this.sendRequest({
              name: "ping"
            });
          }
        };
      })(this)), 30000);
    }
  }

  PlayerClient.prototype.connect = function() {
    this.socket = new WebSocket(window.location.origin.replace("http", "ws"));
    this.socket.onmessage = (function(_this) {
      return function(msg) {
        var err;
        console.info("received: " + msg.data);
        try {
          msg = JSON.parse(msg.data);
          if (msg.request_id != null) {
            if (_this.pending_requests[msg.request_id] != null) {
              _this.pending_requests[msg.request_id](msg);
              delete _this.pending_requests[msg.request_id];
            }
          }
          if (msg.name === "project_file_updated") {
            _this.player.runtime.projectFileUpdated(msg.type, msg.file, msg.version, msg.data, msg.properties);
          }
          if (msg.name === "project_file_deleted") {
            _this.player.runtime.projectFileDeleted(msg.type, msg.file);
          }
          if (msg.name === "project_options_updated") {
            return _this.player.runtime.projectOptionsUpdated(msg);
          }
        } catch (error) {
          err = error;
          return console.error(err);
        }
      };
    })(this);
    this.socket.onopen = (function(_this) {
      return function() {
        var i, j, k, len, len1, len2, maps, project, ref, ref1, ref2, s, sources, sprites, user;
        _this.reconnect_delay = 1000;
        user = location.pathname.split("/")[1];
        project = location.pathname.split("/")[2];
        _this.send({
          name: "listen_to_project",
          user: user,
          project: project
        });
        if (!_this.version_checked) {
          _this.version_checked = true;
          sprites = {};
          maps = {};
          sources = {};
          ref = _this.player.resources.images;
          for (i = 0, len = ref.length; i < len; i++) {
            s = ref[i];
            sprites[s.file.split(".")[0]] = s.version;
          }
          ref1 = _this.player.resources.maps;
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            s = ref1[j];
            maps[s.file.split(".")[0]] = s.version;
          }
          ref2 = _this.player.resources.sources;
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            s = ref2[k];
            sources[s.file.split(".")[0]] = s.version;
          }
          return _this.sendRequest({
            name: "get_file_versions",
            user: user,
            project: project
          }, function(msg) {
            var info, name, ref3, ref4, ref5, results, v;
            ref3 = msg.data.sources;
            for (name in ref3) {
              info = ref3[name];
              v = sources[name];
              if ((v == null) || v !== info.version) {
                _this.player.runtime.projectFileUpdated("ms", name, info.version, null, info.properties);
              }
            }
            ref4 = msg.data.sprites;
            for (name in ref4) {
              info = ref4[name];
              v = sprites[name];
              if ((v == null) || v !== info.version) {
                _this.player.runtime.projectFileUpdated("sprites", name, info.version, null, info.properties);
              }
            }
            ref5 = msg.data.maps;
            results = [];
            for (name in ref5) {
              info = ref5[name];
              v = maps[name];
              if ((v == null) || v !== info.version) {
                results.push(_this.player.runtime.projectFileUpdated("maps", name, info.version, null, info.properties));
              } else {
                results.push(void 0);
              }
            }
            return results;
          });
        }
      };
    })(this);
    return this.socket.onclose = (function(_this) {
      return function() {
        setTimeout((function() {
          return _this.connect();
        }), _this.reconnect_delay);
        return _this.reconnect_delay += 1000;
      };
    })(this);
  };

  PlayerClient.prototype.send = function(data) {
    return this.socket.send(JSON.stringify(data));
  };

  PlayerClient.prototype.sendRequest = function(msg, callback) {
    msg.request_id = this.request_id++;
    this.pending_requests[msg.request_id] = callback;
    return this.send(msg);
  };

  return PlayerClient;

})();


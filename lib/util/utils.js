
var util = require("util");
var jsonHelper = require('jsonify');

var trimRegex = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g;
var escapeRe  = /('|\\)/g;
var charToEntityRegex;

function trim(string) {
  return string.toString().replace(trimRegex, "");
}

function htmlEncodeReplaceFn(match, capture) {
  return charToEntity[capture];
}

module.exports = exports = {
  trim: trim,
  escape: function (string) {
    return string.replace(escapeRe, "\\$1");
  },
  encode: function (paramObj) {
    return JSON.stringify(paramObj);
  },
  htmlEncode: function (value) {
    return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
  },
  decode: function (paramString, safe) {
    try {
      return jsonHelper.parse(this.htmlEncode(paramString));

    } catch (e) {

      if (safe === true) {
        util.log("Exception Handled Here" + util.inspect(e));
        return null;
      }

    }
  }

}
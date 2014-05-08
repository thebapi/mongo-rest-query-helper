/**
 * Mongo Rest Query Helper
 * Turns request Query into Mongo db criteria.
 *
 *    @example
 *
 *    anyUrl?filter=[{"property":"grade","value":["K-5","6-8"],"operator":"in","condition":"and","exactMatch":true},{"property":"regionType","value":["Suburban","Rural","Urban"],"operator":"in","condition":"and","exactMatch":true},{"property":"subject","value":["Social Studies","Reading","Music","Family and Consumer Science","Information Technology"],"operator":"in","condition":"and","exactMatch":true},{"property":"standardId","value":["51e973c89c9ceb6413000007","51ac7d2b2e8fcb540f00000b","51ac7ce82e8fcb540f000007","52b7df73e3422b938c3c157e","51ac58964105cef409000009","51ac576d84a786df1bbd2c5d","51ac58964105cef409000006","51ac58964105cef409000004","51ac58964105cef409000003"],"operator":"in","condition":"and","exactMatch":true}]
 *
 *    turns into :
 *
 *
 *
 *
 * @type {*}
 */

var utils = require("./util/utils");
var util  = require("util");
var  _    = require("underscore");


function attachFilters(key, newFilters, filters) {

  filters.forEach(function (filterItem) {

    var pushedItem = {};
    pushedItem[filterItem.property] = filterItem.value;

    if (!newFilters[key]) {
      newFilters[key] = [];
    }
    newFilters[key].push(pushedItem);

  });
  return newFilters;
}

function buildFixWithRegex(filterItem, retVal) {
  var anyMatch = filterItem.anyMatch;
  var caseSensitive = filterItem.caseSensitive;
  var exactMatch = filterItem.exactMatch;
  if (anyMatch && (anyMatch === true)) {
    if (caseSensitive === true) {
      retVal = new RegExp(retVal, "g");
    } else {
      retVal = new RegExp(retVal, "gi");
    }
  } else if (exactMatch && (exactMatch === true)) {
    if (caseSensitive === true) {
      retVal = new RegExp("^" + retVal + "$", "g");
    } else {
      retVal = new RegExp("^" + retVal + "$", "gi");
    }
  }
  return retVal;
}

function handleEqualOps(filterItem) {
  var retVal = filterItem.value;
  retVal = buildFixWithRegex(filterItem, retVal);
  filterItem.value = retVal;
  return filterItem;
}


function handleInOps(filterItem) {
  var retVal = filterItem.value;
  if (!_.isArray(retVal)) {
    retVal = [retVal];
  }

  for (var i = 0; i < retVal.length; i++) {
    retVal[i] = buildFixWithRegex(filterItem, retVal[i]);
  }
  filterItem.value = { "$in": retVal};
  return filterItem;
}


function handleNotInOps(filterItem) {
  var retVal = filterItem.value;
  if (!commonUtil.isArray(retVal)) {
    retVal = [retVal];
  }
  for (var i = 0; i < retVal.length; i++) {
    retVal[i] = buildFixWithRegex(filterItem, retVal[i]);
  }
  filterItem.value = { "$nin": retVal};
  return filterItem;
}

function handleNotEqualOps(filterItem) {
  var retVal = filterItem.value;
  filterItem.value = { "$ne": retVal};
  return filterItem;
}

function handleLessOps(filterItem) {
  var retVal = filterItem.value;
  filterItem.value = { "$lt": retVal};
  return filterItem;
}

function handleMoreOps(filterItem) {
  var retVal = filterItem.value;
  filterItem.value = { "$gt": retVal};
  return filterItem;
}


function handleLessEqualOps(filterItem) {
  var retVal = filterItem.value;
  filterItem.value = { "$lte": retVal};
  return filterItem;
}

function handleMoreEqualOps(filterItem) {
  var retVal = filterItem.value;
  filterItem.value = { "$gte": retVal};
  return filterItem;
}


function buildFixForOperator(operator, filterItem) {
  switch (operator) {
    case "=" :
      filterItem = handleEqualOps(filterItem);
      break;
    case "in":
      filterItem = handleInOps(filterItem);
      break;
    case "nin":
      filterItem = handleNotInOps(filterItem);
      break;
    case "ne":
    case "!=":
      filterItem = handleNotEqualOps(filterItem);
      break;
    case "lt":
    case "<":
      filterItem = handleLessOps(filterItem);
      break;
    case "gt":
    case ">":
      filterItem = handleMoreOps(filterItem);
      break;
    case "lte":
    case "<=":
      filterItem = handleLessEqualOps(filterItem);
      break;
    case "gte":
    case ">=":
      filterItem = handleMoreEqualOps(filterItem);
      break;
  }
  return filterItem;
}

function QueryHelper() {

}

QueryHelper.prototype.processFilters = function (filters) {

  if (!filters) {
    filters = {};
  }

  if (filters && typeof filters === 'string') {
    filters = utils.decode(filters, true);
    if(filters === null){
      return filters;
    }
  }

  var newFilters = {};
  var andFilters = [];
  var orFilters = [];
  var notFilters = [];
  var norFilters = [];

  if(Object.keys(filters).length<1){
    return newFilters;
  }

  if (!_.isArray(filters)) {
    filters = [filters];
  }

  filters.forEach(function (filterItem) {
    if(utils.isUndefined(filterItem)){
      filterItem = {};
    }
    if (typeof filterItem === 'string') {
      filterItem = utils.decode(filterItem, true);
    }
    if (filterItem) {

      if (utils.isUndefined(filterItem.condition)) {
        filterItem.condition = "and";
      }
      if (utils.isUndefined(filterItem.operator)) {
        filterItem.operator = "=";
      }

      var property  = filterItem.property;
      var operator  = utils.trim(filterItem.operator.toString()).toLowerCase();
      var condition = utils.trim(filterItem.condition.toString()).toLowerCase();

      filterItem    = buildFixForOperator(operator, filterItem);

      var retVal = filterItem.value;
      switch (condition) {

        case "or"  :
          orFilters.push({property: property, value: retVal});
          break;
        case "not" :
          notFilters.push({property: property, value: retVal});
          break;
        case "nor" :
          norFilters.push({property: property, value: retVal});
          break;
        case "and" :
          andFilters.push({property: property, value: retVal});
          break;
        default:
          andFilters.push({property: property, value: retVal});
          break;
      }
    }
  });

  newFilters = attachFilters("$and", newFilters, andFilters);
  if (Object.keys(orFilters).length > 0) {
    newFilters = attachFilters("$or", newFilters, orFilters);
  }
  if (Object.keys(notFilters).length > 0) {
    newFilters = attachFilters("$not", newFilters, notFilters);
  }
  if (Object.keys(norFilters).length > 0) {
    newFilters = attachFilters("$nor", newFilters, norFilters);
  }
  return newFilters;
}




module.exports = new QueryHelper();

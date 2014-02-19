
var mongoQueryHelper = require('../../index');

var  should = require('should'),
  util = require('util'),
  underscore = require('underscore'),
  expect = require('expect.js');

var filter1 = {
  property : 'userName',
  value    : 'thebapi',
  operator : "=",
  anyMatch : true
};
var filter2 = {
  property : 'firstName',
  value    : 'Sajib',
  operator : "="
};

var filter3 = {
  property : 'city',
  value    : "newyork",
  operator : "="
};

var filter4 = {
  property : 'lastName',
  value    :  ["sarkar", "roy"],
  operator : "in",
  condition: "or"
};

var filter5 = {
  property : 'firstName',
  value    : 'Bapi',
  operator : "=",
  condition: 'OR'
};

var filter6 = {
  property : 'loginCount',
  value    : 20,
  operator : "<"
};

var filter7 = {
  property : 'loginCount',
  value    : 5,
  operator : "gte"
};

var filter8 = {
  property : 'countryCode',
  value    : "BD",
  operator : "=",
  exactMatch: true
};
var filters = [filter1, filter2, filter3, filter4, filter5, filter6, filter7, filter8];
var newFilter = mongoQueryHelper.processFilters(filters);

describe("Mongo Query Helper tests", function () {

  it("mongoQueryHelper should be an instance of class!", function (done) {
    should.exist(mongoQueryHelper);
    should.exist(mongoQueryHelper.processFilters);
    done();
  });

  it("ProcessFilters should build anf return a filter object", function (done) {
    expect(typeof newFilter).to.be.eql("object");
    util.log(util.inspect(newFilter));
    done();
  });

  it("Should process the filter if we pass the whole filter object as string", function (done) {
    var newFilter1 = mongoQueryHelper.processFilters(JSON.stringify(filters));
    expect(typeof newFilter1).to.be.eql("object");
    done();
  });

  it("Processed filter should have a $and property", function (done) {
    should.exists(newFilter["$and"]);
    done();
  });

  it("Processed filter should have a $or property", function (done) {
    should.exists(newFilter["$or"]);
    done();
  });
});
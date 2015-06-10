var superagent = require("superagent"),
    chai = require("chai"),
    expect = chai.expect,
    should = require("should"),
    nock = require("nock");

describe("Index", function() {
  it("renders something", function(done) {
    superagent.get("http://localhost:3001/")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Open issues", function() {
  it("renders open issues info", function(done) {
    superagent.get("http://localhost:3001/issues?repo=shippable/support"+
      "&token=8b5764559d5cc7d8dd41ef7e639dc238eab4338a&days=2&daysEnd=5&state=Open")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.should.be.json;
      res.text.should.containEql("open");
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Closed issues", function() {
  it("renders closed issues info", function(done) {
    superagent.get("http://localhost:3001/issues?repo=shippable/support&"+
      "&token=8b5764559d5cc7d8dd41ef7e639dc238eab4338a&days=2&daysEnd=5&state=Close")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.should.be.json;
      res.text.should.containEql("close");
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Failed auth", function() {
  it("Should not render issues page, instead main page", function(done) {
    superagent.get("http://localhost:3001/issues?repo=shippable/support&token=no&days=2&daysEnd=5&state=Open")
    .end(function(err, res) {
      res.text.should.not.containEql("open");
      res.text.should.not.containEql("close");
      done();
    });
  });
});
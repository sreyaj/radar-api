var superagent = require("superagent"),
    chai = require("chai"),
    expect = chai.expect,
    should = require("should");

describe("Index", function() {
  it("renders HTML", function(done) {
    superagent.get("http://localhost:3000/")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.should.be.html;
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Issues page", function() {
  it("renders a page with an issues table", function(done) {
    superagent.get("localhost:3000/issues?username=shippable&repo=support&token=47df5e1408f4105cfb764e7c0f5cd19bc7a5aa95&days=2&daysEnd=5&state=Open")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.text.should.startWith("<!DOCTYPE html>\n<html>\n  <head>\n    <title>Issues</title>");
      done();
    });
  });
});
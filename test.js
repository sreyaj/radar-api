var superagent = require("superagent"),
    chai = require("chai"),
    expect = chai.expect,
    should = require("should"),
    nock = require("nock");
var request = require('sync-request');

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

describe("Open issues", function() {
  it("renders open issues page", function(done) {
    this.timeout(15000);
    superagent.get("http://localhost:3000/issues?username=shippable&repo=support&token=59c00bbcdcdf851f7ad9ac905000c7f4d31f30f7&days=2&daysEnd=5&state=Open")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.text.should.startWith("<!DOCTYPE html>\n<html>\n  <head>\n    <title>Issues</title>");
      res.text.should.containEql("Open Issues");
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Closed issues", function() {
  it("renders closed issues page", function(done) {
    this.timeout(15000);
    superagent.get("http://localhost:3000/issues?username=shippable&repo=support&token=59c00bbcdcdf851f7ad9ac905000c7f4d31f30f7&days=2&daysEnd=5&state=Close")
    .end(function(err, res) {
      (err === null).should.equal(true);
      res.text.should.startWith("<!DOCTYPE html>\n<html>\n <head>\n   <title>Issues</title>");
      res.text.should.containEql("Closed Issues");
      res.statusCode.should.equal(200);
      done();
    });
  });
});

describe("Failed auth", function() {
  it("Should not render issues page, instead main page", function(done) {
    this.timeout(15000);
    superagent.get("http://localhost:3000/issues?username=shippable&repo=support&token=no&days=2&daysEnd=5&state=Open")
    .end(function(err, res) {
      res.text.should.startWith("<!DOCTYPE html>\n<html>\n  <head>\n    <title>Issue Timeline</title>");
      done();
    });
  });
});



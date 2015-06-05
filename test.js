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

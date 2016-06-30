var istanbul = require('istanbul');
var fs = require('fs');

module.exports = function(files) {
    console.log(files);
    files = files || [];

    var collector = new istanbul.Collector();

    files.forEach(function(file) {
        var coverage = JSON.parse(fs.readFileSync(file, 'utf8'));
        collector.add(coverage);
    });

    var reporter = new istanbul.Reporter();

    reporter.addAll(['json-summary']);

    reporter.write(collector, false, function() {
        console.log(reporter);
    });
}

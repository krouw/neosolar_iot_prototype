(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('axios'), require('cheerio')) :
	typeof define === 'function' && define.amd ? define(['axios', 'cheerio'], factory) :
	(factory(global.axios,global.cheerio));
}(this, (function (axios,cheerio) { 'use strict';

axios = axios && 'default' in axios ? axios['default'] : axios;
cheerio = cheerio && 'default' in cheerio ? cheerio['default'] : cheerio;

//Data acquisition Hioki

var acquisition = function acquisition() {
	return new Promise(function (resolve, reject) {
		axios.get('http://192.168.0.50/REALDATA.HTM?%3ACOMPORT%3AWEBORGUNIT=UNIT2%3B').then(function (res) {
			var $ = cheerio.load(res.data);
			var table = $('BODY CENTER TABLE[cellspacing=0]').toArray();
			var intensityDOM = table[0].children[6].children[4].children[0].children[0].data;
			var battery1DOM = table[0].children[2].children[1].children[0].children[0].data;
			var battery2DOM = table[0].children[2].children[4].children[0].children[0].data;
			var battery3DOM = table[0].children[3].children[1].children[0].children[0].data;
			var battery4DOM = table[0].children[3].children[4].children[0].children[0].data;
			var voltageDOM = table[0].children[4].children[1].children[0].children[0].data;
			var splitVT = voltageDOM.split('V');
			var splitB1 = battery1DOM.split('V');
			var splitB2 = battery2DOM.split('V');
			var splitB3 = battery3DOM.split('V');
			var splitB4 = battery4DOM.split('V');
			var splitI = intensityDOM.split('A');
			var msm = {
				intensity: 1,
				voltageTotal: parseFloat(splitVT[0]),
				battery: {
					battery1: parseFloat(splitB1),
					battery2: parseFloat(splitB2),
					battery3: parseFloat(splitB3),
					battery4: parseFloat(splitB4)
				}
			};
			resolve({
				msm: msm
			});
		}).catch(function (err) {
			reject({
				error: err
			});
		});
	});
};

function setAuthorizationToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}

var id = '594030300b346046243c8525';
var password = '123456';
var api = 'http://pird.ddns.net:7000/api';

var persist = function persist(body) {

	axios.post(api + '/device/' + id + '/measurement', body).then(function (res) {
		console.log(res.data.data);
	}).catch(function (err) {
		console.log(err.response.data);
	});
};

var bodyAuth = {
  id: id,
  password: password
};
var token = '';

axios.post(api + '/auth/device', bodyAuth).then(function (res) {
  token = res.data.token;
  var body = {};
  setAuthorizationToken(token);
  setInterval(function () {
    acquisition().then(function (_ref) {
      var msm = _ref.msm;

      persist(msm);
    }).catch(function (err) {
      console.log('Error acquisition ' + err.response.data);
    });
  }, 6000);
}).catch(function (err) {
  console.log('Error Login ' + err.response.data);
});

})));
//# sourceMappingURL=app.js.map

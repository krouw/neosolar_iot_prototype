'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var axios = _interopDefault(require('axios'));
var cheerio = _interopDefault(require('cheerio'));

//Data acquisition Hioki

const acquisition = () => {
	return new Promise((resolve, reject) => {
		axios.get('http://192.168.0.50/REALDATA.HTM?%3ACOMPORT%3AWEBORGUNIT=UNIT2%3B').then(res => {
			const $ = cheerio.load(res.data);
			const table = $('BODY CENTER TABLE[cellspacing=0]').toArray();
			const intensityDOM = table[0].children[6].children[4].children[0].children[0].data;
			const battery1DOM = table[0].children[2].children[1].children[0].children[0].data;
			const battery2DOM = table[0].children[2].children[4].children[0].children[0].data;
			const battery3DOM = table[0].children[3].children[1].children[0].children[0].data;
			const battery4DOM = table[0].children[3].children[4].children[0].children[0].data;
			const voltageDOM = table[0].children[4].children[1].children[0].children[0].data;
			let splitVT = voltageDOM.split('V');
			let splitB1 = battery1DOM.split('V');
			let splitB2 = battery2DOM.split('V');
			let splitB3 = battery3DOM.split('V');
			let splitB4 = battery4DOM.split('V');
			let splitI = intensityDOM.split('A');
			let msm = {
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
		}).catch(err => {
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

const id = '594030300b346046243c8525';
const password = '123456';
const api = 'http://pird.ddns.net:7000/api';

const persist = body => {

	axios.post(`${api}/device/${id}/measurement`, body).then(res => {
		console.log(res.data.data);
	}).catch(err => {
		console.log(err.response.data);
	});
};

const bodyAuth = {
  id: id,
  password: password
};
let token = '';

axios.post(`${api}/auth/device`, bodyAuth).then(res => {
  token = res.data.token;
  let body = {};
  setAuthorizationToken(token);
  setInterval(() => {
    acquisition().then((_ref) => {
      let msm = _ref.msm;

      persist(msm);
    }).catch(err => {
      console.log('Error acquisition ' + err.response.data);
    });
  }, 6000);
}).catch(err => {
  console.log('Error Login ' + err.response.data);
});
//# sourceMappingURL=main.js.map

function BPrayTimes(id, mode)
{
	this.prayTimes = new PrayTimes();
	this.id = id;
	this.mode = parseInt(mode, 10);
	this.today = new Date();
	this.timeFormat = 1; 
	var _self = this;
	$(this.id+'_year').val(this.today.getFullYear());
	$(this.id+"_month option[value='" + this.today.getMonth()+ "']").attr('selected', 'true');
	$(this.id+'_timezone').val('auto');
	
	if (2 !== this.mode)
	{
		$('.pt_full').css('display', 'none');
	}
	
	this.update = function(evt, location) {
		var country = $(_self.id+'_country').val();
		var city = $(_self.id+'_city').val();
		var loc = _self.findLocation(country, city, location);
		if (false !== loc)
		{
			var lat = loc.lat; //$(_self.id+'_latitude').val();
			var lng = loc.lng; //$(_self.id+'_longitude').val();
			var timeZone = $(_self.id+'_timezone').val();
			var dst = $(_self.id+'_dst').val();
			var year = $(_self.id+'_year').val();
			var month = $(_self.id+'_month').val();
			var day = (_self.mode === 2 ? -1 : _self.today.getDate());
			var method = $(_self.id+'_method').val();
			_self.makeTable(method, parseInt(year), parseInt(month), parseInt(day), lat, lng, timeZone, dst);
		}
	};
	
	this.makeTable = function(method, year, month, day, lat, lng, timeZone, dst) {
		var items = {day: '', fajr: 'Fajr', sunrise: 'Shuruq', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha'};// sunset: 'Sunset',
		var tbody = document.createElement('tbody');
		if (_self.mode !== 1)
			tbody.appendChild(_self.makeTableRow(items, items, 'pt_tablerow_head'));
		if (0 <= day && day <= 31) {
			var date = new Date(year, month, day);
			var endDate = new Date(year, month, day);
			endDate.setDate(endDate.getDate() + 1)
		}
		else if (0 <= month && month <= 11) {
			var date = new Date(year, month, 1);
			var endDate = new Date(year, month + 1, 1);
		}
		else {
			var date = new Date(year, 0, 1);
			var endDate = new Date(year + 1, 0, 1);
		}
		var format = (_self.timeFormat ? '12hNS' : '24h');
		_self.prayTimes.setMethod(method);
		while (date < endDate) {
			var times = _self.prayTimes.getTimes(date, [lat, lng], timeZone, dst, format);
			times.day = date.getDate() + ' ' + _self.monthShortName(date.getMonth()) + ' ' + date.getFullYear();
			var klass = (_self.mode === 2 && date.getMonth() == _self.today.getMonth() && date.getDate() == _self.today.getDate() ? 'pt_tablerow_today' : 'pt_tablerow');
			if (_self.mode !== 1)
				tbody.appendChild(_self.makeTableRow(times, items, klass));
			date.setDate(date.getDate() + 1); // next day
		}
		if (_self.mode === 1)
			_self.createVerticalTable(tbody, times, items);
		$(_self.id+'_tabletime').empty();
		$(_self.id+'_tabletime').append(tbody);
	};
	
	// make a table row
	this.makeTableRow = function(data, items, klass) {
		var cell, row = document.createElement('tr');
		for (var i in items) {
			cell = document.createElement('td');
			cell.innerHTML = data[i];
			//cell.style.width = i=='day' ? '2.5em' : '3.7em';
			row.appendChild(cell);
		}
		row.className = klass;
		return row;		
	};
	
	// make a vertical table
	this.createVerticalTable= function(tbody, data, items)
	{
		var row, cell;
		row = document.createElement('tr');
		cell = document.createElement('td');
		cell.innerHTML = data['day'];
		cell.className = 'pt_tablerow_today';
		cell.colSpan = 2;
		row.appendChild(cell);
		tbody.appendChild(row);
		for (var i in items)
		{
			if ('day' == i)
				continue;
			row = document.createElement('tr');
			cell = document.createElement('td');
			cell.innerHTML = items[i];
			cell.className = 'pt_table_cellhead';
			row.appendChild(cell);
			cell = document.createElement('td');
			cell.innerHTML = data[i];
			cell.className = 'pt_table_cell';
			row.appendChild(cell);
			tbody.appendChild(row);
		}	
	};
	
	// switch time format
	this.switchFormat = function(location) {
		var domFmtVal = $(_self.id+'_timefmtval').first();
		var offset = parseInt(domFmtVal.val());
		var formats = ['24-heures', '12-heures'];
		_self.timeFormat = (1 + offset) % 2;
		domFmtVal.val(_self.timeFormat);
		$(_self.id+'_timeformat').html(formats[_self.timeFormat]);
		_self.update(null, location);
	};
	
	// return month full name
	this.monthFullName = function(month) {
		var monthName = new Array('Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre');
		return monthName[month];
	};
	
	// return month short name
	this.monthShortName = function(month) {
		var monthName = new Array('Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc');
		return monthName[month];
	};
	
	// Get latitude and langitude from country + city
	this.findLocation = function(country, city, location)
	{
		if (2 !== this.mode)
			country = '';
		var theUrl = 'https://maps.googleapis.com/maps/api/geocode/json?'+(location ? 'latlng='+location.latitude+','+location.longitude : 'address='+country+'+'+city);
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, false);
		xmlHttp.send(null);
		var response = JSON.parse(xmlHttp.responseText);
		if (typeof response != 'undefined' && typeof response.status != 'undefined')
		{
			if ('OK' == response.status)
			{
				var lat = response.results[0]['geometry']['location']['lat'];
				var lng = response.results[0]['geometry']['location']['lng'];
				$(_self.id+'_latitude').val(lat);
				$(_self.id+'_longitude').val(lng);
				
				theUrl = 'https://maps.googleapis.com/maps/api/timezone/json?location='+lat +','+lng +'&sensor=false&timestamp='+($.now() / 1000);
				xmlHttp = new XMLHttpRequest();
				xmlHttp.open("GET", theUrl, false);
				xmlHttp.send(null);
				var response2 = JSON.parse(xmlHttp.responseText);
				if (typeof response2 != 'undefined' && typeof response2.status != 'undefined' && 'OK' == response2.status)
				{
					$(_self.id+'_timezone').val(response2.rawOffset ? response2.rawOffset / 3600 : response2.rawOffset);
					$(_self.id+'_dst').val(response2.dstOffset ? response2.dstOffset / 3600 : response2.dstOffset);
				}
				var i, elt;
				for (i = 0; i < response.results[0].address_components.length; i++)
				{
					elt = response.results[0].address_components[i];
					if (elt.types[0] == 'locality')
						$(_self.id+'_city').val(elt.long_name);
					else if (elt.types[0] == 'country')
						$(_self.id+'_country').val(elt.long_name);
				}
				$(_self.id+'_error').html('');
				return {'lat':lat,'lng':lng};
			}
			else
			{
				$(_self.id+'_city').val('');
				$(_self.id+'_error').html('Erreur de détection du lieu : '+response.status);
			}
		}
		else
		{
			$(_self.id+'_city').val('');
			$(_self.id+'_error').html('Erreur de détection du lieu');
		}
		return false;
	};
	
	// Add event listener
	$(this.id+'_form').on('submit', this.update);
	$(this.id+'_country').on('change', this.update);
	$(this.id+'_city').on('change', this.update);
	$(this.id+'_latitude').on('change', this.update);
	$(this.id+'_longitude').on('change', this.update);
	$(this.id+'_year').on('change', this.update);
	$(this.id+'_month').on('change', this.update);
	$(this.id+'_timezone').on('change', this.update);
	$(this.id+'_dst').on('change', this.update);
	$(this.id+'_method').on('change', this.update);
	$(this.id+'_timeformat').on('click', this.switchFormat);

	if ("geolocation" in navigator)
	{
		navigator.geolocation.getCurrentPosition(
			function(position) { 
				_self.switchFormat(position.coords);
			}
			,function() {
				_self.switchFormat();
			}
	        );
	}
	else
		this.switchFormat();
}
(function ($) {

    var provices = [
        {"id": 110, "name": "北京"},
        {"id": 120, "name": "天津"},
        {"id": 310, "name": "上海"},
        {"id": 130, "name": "河北省"},
        {"id": 140, "name": "山西省"},
        {"id": 320, "name": "江苏省"},
        {"id": 330, "name": "浙江省"},
        {"id": 340, "name": "安徽省"},
        {"id": 350, "name": "福建省"},
        {"id": 360, "name": "江西省"},
        {"id": 370, "name": "山东省"},
        {"id": 410, "name": "河南省"},
        {"id": 420, "name": "湖北省"},
        {"id": 430, "name": "湖南省"},
        {"id": 440, "name": "广东省"},
        {"id": 450, "name": "广西壮族自治区"},
        {"id": 450, "name": "海南省"},
        {"id": 500, "name": "重庆市"},
        {"id": 510, "name": "四川省"},
        {"id": 520, "name": "贵州省"},
        {"id": 530, "name": "云南省"},
        {"id": 610, "name": "陕西省"},
        {"id": 620, "name": "甘肃省"},
        {"id": 630, "name": "青海省"},
        {"id": 150, "name": "内蒙古自治区"},
        {"id": 640, "name": "宁夏回族自治区"},
        {"id": 650, "name": "新疆维吾尔自治区"},
        {"id": 540, "name": "西藏自治区"}
    ];

    var AddressSelector = function (element) {
        this.element = element;
        this.default = {
            "province": "北京",
            "city": "东城区"
        };
    };
    AddressSelector.prototype.initDocument = function () {
        var self = this;
        $("<select id=\"province\"></select>").appendTo(self.element);
        $("<select id='city'></select>").appendTo(self.element);
        $("<select id='region'></select>").appendTo(self.element);
        $("<select id='town'></select>").appendTo(self.element);
        $("<select id='village'></select>").appendTo(self.element);
        self.provice = self.element.children("#province");
        self.city = self.element.children("#city");
        self.region = self.element.children("#region");
        self.town = self.element.children("#town");
        self.village = self.element.children("#village");

        $.each(provices, function (index, provice) {
            self.provice.append($("<option>", {
                "value": provice.name,
                "text": provice.name,
                "data-id": provice.id
            }));
        });

        var provinceId = $(self.provice).find(":selected").data("id");
        self.getCities(provinceId);
    };
    AddressSelector.prototype.getCities = function (provinceId) {
        var self = this;
        self.clear(self.city);
        self.fetchData("../data/city/" + provinceId + ".json", function (json) {
            for (var city of json) {
                self.city.append($("<option>", {
                    "value": city.city_name,
                    "text": city.city_name,
                    "data-id": city.city_id
                }));
            }
            var cityId = $(self.city).find("option:first").data("id");
            self.getRegions(provinceId, cityId);
        });
    };
    AddressSelector.prototype.getRegions = function (provinceId, cityId) {
        var self = this;
        self.clear(self.region);
        self.fetchData("../data/region/" + provinceId + ".json", function (json) {
            for (var region of json) {
                if (region.city_id == cityId) {
                    self.region.append($("<option>", {
                        "value": region.county_name,
                        "text": region.county_name,
                        "data-id": region.county_id
                    }));
                }
            }
            var regionId = $(self.region).find(":selected").data("id");
            self.getTowns(provinceId, regionId);
        });
    };
    AddressSelector.prototype.getTowns = function (provinceId, regionId) {
        var self = this;
        self.clear(self.town);
        self.fetchData("../data/town/" + provinceId + ".json", function (json) {
            for (var town of json) {
                if (town.county_id == regionId) {
                    self.town.append($("<option>", {
                        "value": town.town_name,
                        "text": town.town_name,
                        "data-id": town.town_id
                    }));
                }
            }
            var townId = $(self.town).find(":selected").data("id");
            self.getVillages(provinceId, townId);
        });
    };
    AddressSelector.prototype.getVillages = function (provinceId, townId) {
        var self = this;
        self.clear(self.village);
        self.fetchData("../data/village/" + provinceId + ".json", function (json) {
            for (var village of json) {
                if (village.town_id == townId) {
                    self.village.append($("<option>", {
                        "value": village.village_name,
                        "text": village.village_name,
                        "data-id": village.village_id
                    }));
                }
            }
        });
    };

    AddressSelector.prototype.bind = function () {
        var self = this;
        self.element.delegate("#province", "change", function () {
            var provinceId = $(this).find(":selected").data("id");
            self.getCities(provinceId);
        }).delegate("#city", "change", function () {
            var provinceId = $(self.provice).find(":selected").data("id");
            var cityId = $(this).find(":selected").data("id");
            self.getRegions(provinceId, cityId)
        }).delegate("#region", "change", function () {
            var provincedId = $(self.provice).find(":selected").data("id");
            var regionId = $(this).find(":selected").data("id");
            self.getTowns(provincedId, regionId);
        }).delegate("#town", "change", function () {
            var provinceId = $(self.provice).find(":selected").data("id");
            var townId = $(this).find(":selected").data("id");
            self.getVillages(provinceId, townId);
        }).delegate("#village", "change", function () {
            var address = {
                provice: self.provice.val(),
                city: self.city.val(),
                region: self.region.val(),
                town: self.town.val(),
                village: self.village.val()
            };
            console.log(JSON.stringify(address));
        });
    };
    AddressSelector.prototype.fetchData = function (file, callback) {
        $.getJSON(file, {}, function (data) {
            callback(data);
        });
    };
    AddressSelector.prototype.clear = function (selector) {
        selector.empty();
    };

    $.fn.extend({
        "addressElements": function () {
            this.each(function (index, element) {
                var address_selector = new AddressSelector($(element));
                address_selector.initDocument();
                address_selector.bind();
            });
        }
    });
})(jQuery);

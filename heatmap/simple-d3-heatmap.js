/// this script is based on https://github.com/team-centric-software/simple-d3-heatmap, but with custom onclick
/// function
class SimpleD3Heatmap {
    constructor(t = {}) {
        this.hours = d3.range(24), this.minColor = t.minColor || "#ECF5E2", this.maxColor = t.maxColor || "#222081", this.colorMode = t.colorMode || 2, this.gutterSize = t.gutterSize || .1, this.outerSize = t.outerSize || .35, this.scale = t.scale || 1, this.showLines = t.showLines || !1, this.showTicks = t.showTicks || !0, this.locale = t.locale || "en-US", this.dayNameLength = t.dayNameLength || "long", this.showMonth = t.showMonth || !0, this.includeWeekend = t.includeWeekend || !0, this.tooltipClass = t.tooltipClass || "d3-calendar-tooltip", this.enableAnimations = t.enableAnimations || !0;
        const e = t.mobileViewPx || 1200;
        if (this.mobileView = window.innerWidth < e, d3.select("#tooltipDiv").empty()) {
            d3.select("body").append("div").attr("style", "font-family: 'Tahoma'; position: absolute;")
                .attr("class", this.tooltipClass).attr("id", "tooltipDiv").style("display", "none");
            const t = document.createElement("style");
            t.type = "text/css";
            const e = "@keyframes simple-d3-heatmaps-cubeanim {\n\t\t\t\tfrom {\n\t\t\t\t\topacity: 0;\n\t\t\t\t\twidth: 0;\n\t\t\t\t\theight: 0;\n\t\t\t\t}\n\t\t\t\tto {\n\t\t\t\t\topacity: 1;\n\t\t\t\t}\n\t\t\t}";
            t.innerHTML = e, document.getElementsByTagName("head")[0].appendChild(t)
        }
    }

    yearly(t, e, onclick) {
        const a = this, o = d3.select("#tooltipDiv"), i = 85, n = 0, s = this.showMonth ? 25 : 0, l = 0,
            r = 25 * this.scale * 52 + (i + n) + 300, h = 25 * this.scale * 7 + (s + l), d = [],
            c = d3.select(`#${t}`).append("div"),
            u = c.append("svg").attr("preserveAspectRatio", "xMinYMin meet").attr("style", "display: inline-block; position: absolute; top: 0px; left: 0px;").on("mouseout", function (t) {
                o.style("display", "none")
            });
        if (this.mobileView) {
            c.attr("style", "display: inline-block; position: relative; width: 100%; padding-bottom: 170%; vertical-align: top; overflow: hidden;"), u.attr("viewBox", `${-i} ${-s} ${r / 4 + i + n} ${4 * h + s + l + 25}`);
            for (let t = 0; t < 7; t++) {
                const e = new Date(2019, 0, t);
                d.push(e.toLocaleString(this.locale, {weekday: "short"}))
            }
        } else {
            c.attr("style", "display: inline-block; position: relative; width: 100%; padding-bottom: 12%; vertical-align: top; overflow: hidden;"), u.attr("viewBox", `${-i} ${-s} ${r + i + n} ${h + s + l}`);
            for (let t = 0; t < 7; t++) {
                const e = new Date(2019, 0, t);
                d.push(e.toLocaleString(this.locale, {weekday: this.dayNameLength}))
            }
        }
        if (u.append("g").attr("text-anchor", "end").selectAll("text").data(d3.range(7)).join("text").attr("style", `font-family: 'Tahoma', Arial, serif; font-size: ${this.mobileView ? 18 : 16}px`).attr("x", this.mobileView ? -30 : -5).attr("y", (t, e) => (t + .5) * (25 * this.scale) + e * this.gutterSize).attr("dy", "0.31em").text(t => d[t]), this.mobileView) for (let t = 1; t < 4; t++) u.append("g").attr("text-anchor", "end").selectAll("text").data(d3.range(7)).join("text").attr("style", `font-family: 'Tahoma', Arial, serif; font-size: ${this.mobileView ? 18 : 16}px`).attr("x", -30).attr("y", (e, a) => (e + .5) * (25 * this.scale) + a * this.gutterSize + 200 * t + 15 * t).attr("dy", "0.31em").text(t => d[t]);
        const p = [];
        Object.keys(e).map(t => {
            const a = new Date(parseInt(t, 10)),
                o = p.findIndex(t => t.date === a.getUTCDate() && t.month === a.getUTCMonth() && t.year === a.getUTCFullYear());
            -1 === o ? p.push({
                ts: a.getTime(),
                date: a.getUTCDate(),
                month: a.getUTCMonth(),
                year: a.getUTCFullYear(),
                value: parseFloat(e[t])
            }) : p[o].value += parseFloat(e[t])
        }), (e = p).sort((t, e) => t.ts - e.ts);
        let m = new Date(e[0].ts);
        e.find(t => t.month === m.getMonth() - 1) || m.setMonth(0), m = m.getTime();
        for (let t = 0; t < 365; t++) {
            const a = new Date(m + 864e5 * t), o = a.getUTCDate(), i = a.getUTCMonth(), n = a.getUTCFullYear();
            -1 === e.findIndex(t => t.date === o && t.month === i && t.year === n) && e.push({
                ts: a.getTime(),
                date: o,
                month: i,
                year: n,
                value: 0
            })
        }
        const y = Object.values(e).map(t => t.value), g = Math.max(...y), f = Math.min(...y);
        e.sort((t, e) => t.ts - e.ts);
        const w = d3.utcMonths(new Date(e[0].year, e[0].month, e[0].date), new Date(e[e.length - 1].year, e[e.length - 1].month, e[e.length - 1].date));
        if (w.length > 12) {
            const t = w.length - 12;
            w.splice(12, t)
        }
        this.showMonth && u.selectAll().data(w).enter().append("text").attr("style", `font-family: 'Tahoma', Arial, serif; font-size: ${this.mobileView ? 16 : 18}px`).attr("x", function (t, e) {
            const o = new Date(t);
            if (a.mobileView) {
                if (t.getUTCMonth() >= 3 && t.getUTCMonth() <= 5) {
                    return (d3.utcMonday.count(d3.utcYear(o), d3.utcMonday.ceil(o)) + o.getUTCMonth()) * (25 * a.scale) - 50 - 375 + 25
                }
                if (t.getUTCMonth() >= 5 && t.getUTCMonth() <= 8) {
                    return (d3.utcMonday.count(d3.utcYear(o), d3.utcMonday.ceil(o)) + o.getUTCMonth()) * (25 * a.scale) - 75 - 750 + 25
                }
                if (t.getUTCMonth() >= 9 && t.getUTCMonth() <= 11) {
                    return (d3.utcMonday.count(d3.utcYear(o), d3.utcMonday.ceil(o)) + o.getUTCMonth()) * (25 * a.scale) - 100 - 1125 + 25
                }
            }
            return (d3.utcMonday.count(d3.utcYear(o), d3.utcMonday.ceil(o)) + o.getUTCMonth()) * (25 * a.scale)
        }).attr("y", t => {
            if (a.mobileView) {
                if (t.getUTCMonth() >= 3 && t.getUTCMonth() <= 5) return 210;
                if (t.getUTCMonth() >= 6 && t.getUTCMonth() <= 8) return 425;
                if (t.getUTCMonth() >= 9 && t.getUTCMonth() <= 11) return 640
            }
            return -5
        }).text(t => t.toLocaleString(this.locale, {month: "short"}) + " - " + t.getUTCFullYear()), e.sort((t, e) => t.month - e.month);
        const v = t => (new Date(t).getUTCDay() + 6) % 7;
        u.selectAll()
            .data(e).enter()
            .append("rect")
            .attr("x", function (t, e) {
                const o = new Date(t.ts);
                if (a.mobileView) {
                    if (o.getUTCMonth() >= 3 && o.getUTCMonth() <= 5) {
                        return (d3.utcMonday.count(d3.utcYear(o), o) + o.getUTCMonth()) * (25 * a.scale) - 25 - 375
                    }
                    if (o.getUTCMonth() >= 6 && o.getUTCMonth() <= 8) {
                        return (d3.utcMonday.count(d3.utcYear(o), o) + o.getUTCMonth()) * (25 * a.scale) - 50 - 750
                    }
                    if (o.getUTCMonth() >= 9 && o.getUTCMonth() <= 11) {
                        return (d3.utcMonday.count(d3.utcYear(o), o) + o.getUTCMonth()) * (25 * a.scale) - 75 - 1125
                    }
                }
                return (d3.utcMonday.count(d3.utcYear(o), o) + o.getUTCMonth()) * (25 * a.scale)
            })
            .attr("y", function (t) {
                if (a.mobileView) {
                    if (t.month >= 3 && t.month <= 5) return v(t.ts) * (25 * a.scale) + v(t.ts) * a.gutterSize + 15 + 200;
                    if (t.month >= 6 && t.month <= 8) return v(t.ts) * (25 * a.scale) + v(t.ts) * a.gutterSize + 31 + 400;
                    if (t.month >= 9 && t.month <= 11) return v(t.ts) * (25 * a.scale) + v(t.ts) * a.gutterSize + 46 + 600
                }
                return v(t.ts) * (25 * a.scale) + v(t.ts) * a.gutterSize
            })
            .attr("style", function (t, e) {
                if (a.enableAnimations) return `animation: simple-d3-heatmaps-cubeanim 0.25s ease-out ${75e-5 * e}s; animation-fill-mode: backwards;`
            })
            .attr("width", 25 * this.scale - 1 * this.scale)
            .attr("height", 25 * this.scale - 1 * this.scale)
            .style("fill", function (t) {
                return a.getColor(f, g, t.value)
            })
            .on("mouseover", function (event, t) {
                o.style("display", "block").html(t.value);
                const e = o.node().getBoundingClientRect();
                o.style("left", `${event.pageX - e.width / 2}px`)
                    .style("top", `${event.pageY - e.height - 15}px`)
            })
            .on('click', onclick);
    }

    getColor(t, e, a) {
        let o;
        switch (this.colorMode) {
            default:
            case 1:
                o = d3.scaleLinear().range([this.minColor, this.maxColor]).domain([t, e]);
                break;
            case 2:
                o = d3.scaleSqrt().range([this.minColor, this.maxColor]).domain([0, e]);
                break;
            case 3:
                o = d3.scaleSequential(d3.interpolateCubehelix(this.minColor, this.maxColor)).domain([t, e])
        }
        return o(a)
    }
}
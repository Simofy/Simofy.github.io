var options = {
	complete: 0,
	scale:5.0,
	base_image_url: "",
	base_image_number: "",
	game: {
		w: 600,
		h: 600,
		sites: getUrlParameter("selecteddifficulty") == undefined ? Math.round(2 + Math.random() * 100) : getUrlParameter("selecteddifficulty")
	}
};
var startTime, endTime;
let onlyOnceExc = 0;
var images = {
	main: []
};
let puzzlePieces = [];
let graphic;
var VoronoiData = {
	voronoi: new Voronoi(),
	sites: [],
	diagram: null,
	margin: 10,
	bbox: {
		xl: 0,
		xr: options.game.w,
		yt: 0,
		yb: options.game.h
	}
};
var dragFlag = false;
var jigsawOffset = {};
var whichGroup = -1;
var endGame = false;
let customImage = undefined;
//if (OSName == "Windows" || OSName == "MacOS")
function preload() {

	var xhr = new XMLHttpRequest();
	let definedUrl = getUrlParameter("image");
	if (definedUrl == undefined) definedUrl = 'https://picsum.photos/' + options.game.w + '/' + options.game.h + '?random';
	else
		definedUrl = 'https://picsum.photos/' + options.game.w + '/' + options.game.h + '/?image=' + definedUrl;

	customImage = getUrlParameter("custom");
	if (customImage != undefined) {
		definedUrl = customImage;
		definedUrl = definedUrl.split('"')[1];
	}
	console.log(definedUrl)
	xhr.open('GET', definedUrl, true);
	xhr.onload = function () {
		base_image = new Image();
		base_image.setAttribute('crossOrigin', '');
		let customUrl =
			base_image.src = xhr.responseURL;
		options.base_image_number = customUrl.split('=').pop();
		options.base_image_url = customUrl;
		base_image.onload = function () {

			console.log(this.width + " " + this.height);
			options.game.w = this.width;
			options.game.h = this.height;
			var canvas_ = document.getElementById('game-sketch-canvas');
			context = canvas_.getContext('2d');
			context.drawImage(base_image, 0, 0);
			let image_main = get(0, 0, options.game.w, options.game.h);
			console.log(image_main)
			//image_main.resize(options.game.w * options.scale,options.game.h * options.scale);
			images.main.push(image_main);



			var randomSites = function (n, clear, data) {
				if (clear) {
					data.sites = [];
				}
				var xo = data.margin;
				var dx = data.bbox.xr - data.margin * 2;
				var yo = data.margin;
				var dy = data.bbox.yb - data.margin * 2;
				for (var i = 0; i < n; i++) {
					data.sites.push({
						x: Math.round(xo + Math.random() * dx),
						y: Math.round(yo + Math.random() * dy)
					});
				}
				data.diagram = data.voronoi.compute(data.sites, data.bbox);
			};
			randomSites(options.game.sites, true, VoronoiData);



			let puzzlePiecesUnsorted = [];
			let countBezierId = 0;
			VoronoiData.diagram.edges.forEach(edge => {
				let shapeLine = {
					lSite: edge.lSite,
					rSite: edge.rSite,
					bezier: null
				};
				let l = edge;
				lv = {
					x: l.va.x - l.vb.x,
					y: l.va.y - l.vb.y
				};
				let length = Math.sqrt(lv.x * lv.x + lv.y * lv.y);
				if (l.lSite != null && l.rSite != null) {
					let dir = random([0, 1]);
					shapeLine.bezier = {
						halfPoint: {
							x: (l.va.x + l.vb.x) / 2,
							y: (l.va.y + l.vb.y) / 2
						},
						theta_radians: dir == 0 ? PI / 2 - Math.atan2(l.va.x - l.vb.x, l.vb.y - l.va.y) : PI / 2 - Math.atan2(l.va.x - l.vb.x, l.vb.y - l.va.y) + PI,
						bezierW: length > 50 ? 20 : length / 5,
						bezierH: length > 50 ? 10 : length / 5,
						bezierId: countBezierId++,
						dir: random([0, 1])
					};

				}
				puzzlePiecesUnsorted.push(shapeLine);
			});
			VoronoiData.diagram.cells.forEach(site => {
				let obj = [];
				site.halfedges.forEach(site_line => {

					let compareL = site_line.edge;

					site_line.bezier = null;
					let p_0_bary = Math.atan2(compareL.va.y - site.site.y, compareL.va.x - site.site.x);
					let p_1_bary = Math.atan2(compareL.vb.y - site.site.y, compareL.vb.x - site.site.x);
					let realVa = {
						x: site_line.edge.va.x - site.site.x,
						y: site_line.edge.va.y - site.site.y
					};
					obj.push({
						center: site.site,
						p: realVa, //site_line.edge.va,
						isBezier: false,
						baryOrder: p_0_bary
					});

					let halfPoint = {
						x: (compareL.va.x + compareL.vb.x) / 2,
						y: (compareL.va.y + compareL.vb.y) / 2
					};
					//site_line.baryOrder = ;
					if (compareL.lSite != null && compareL.rSite != null)
						for (let i = 0; i < puzzlePiecesUnsorted.length; i++) {
							line = puzzlePiecesUnsorted[i];
							if (line.lSite != null && line.rSite != null && line.bezier != null)
								if (compareL.lSite.voronoiId == line.lSite.voronoiId &&
									compareL.rSite.voronoiId == line.rSite.voronoiId) {
									site_line.bezier = line.bezier;
									let realh = {
										x: halfPoint.x - site.site.x,
										y: halfPoint.y - site.site.y
									};
									obj.push({
										center: site.site,
										p: realh, //halfPoint,
										isBezier: true,
										bezier: line.bezier,
										baryOrder: Math.atan2(halfPoint.y - site_line.site.y, halfPoint.x - site_line.site.x)
									});
									break;
								}

						}
					let realVb = {
						x: site_line.edge.vb.x - site.site.x,
						y: site_line.edge.vb.y - site.site.y
					};

					obj.push({
						center: site.site,
						p: realVb, //site_line.edge.vb,
						isBezier: false,
						baryOrder: p_1_bary
					});
				});

				puzzlePieces.push({
					edge: obj
				});
			});
			let i = 0;
			puzzlePieces.forEach(site => {
				site.edge.sort(compare);
				let centerPoint = {
					x: 0,
					y: 0
				};


				site.edge.forEach(fac => {
					centerPoint.x += fac.p.x;
					centerPoint.y += fac.p.y;
				});
				centerPoint.x /= site.edge.length;
				centerPoint.y /= site.edge.length;
				site.centerPoint = centerPoint;
				site.origin = {
					x: 0,
					y: 0
				};
				site.origin.x = random(100, width - 100); //site[0].edge[0].center.x;
				site.origin.y = random(100, height - 100); //site[0].edge[0].center.y;
				site.groupId = i++;
				site.voronoiId = site.edge[0].center.voronoiId;

			});

			options.complete = 1;
			background(102, 102, 153);
		}
	};
	xhr.send(null);

}
//if (OSName == "Windows" || OSName == "MacOS")

// windowWidth = window.outerWidth;
// windowHeight = window.outerHeight;

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	//if (OSName == "Windows" || OSName == "MacOS") 
	{
		graphic = createGraphics(windowWidth, windowHeight, WEBGL);
		graphic.show();
		graphic.pixelDensity(1);
		canvas.parent('game-sketch');
		canvas.id('game-sketch-canvas');





	}

	background(0);
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	graphic.resizeCanvas(windowWidth, windowHeight);
}

function draw() {

	if (!options.complete) {
		//still loading
		push();
		background(102, 102, 153);
		textSize(32);
		fill(255)
		translate(width / 2, height / 2);
		//scale(options.scale);
		textAlign(CENTER);
		//if (OSName == "Windows" || OSName == "MacOS")
		text('Loading...', 0, 0);
		//else
		//	text('Mobile phones not yet supported.', 0, 0);
		pop();
	} else {
		if (onlyOnceExc == 0) {
			startTime = new Date();
			onlyOnceExc++;
		}
		graphic.push();
		graphic.translate(-width / 2, -height / 2);
		//graphic.scale(options.scale);
		graphic.background(102, 102, 153);
		background(102, 102, 153);
		if (mouseIsPressed) {
			if (mouseButton === LEFT) {
				if (!dragFlag) {
					dragFlag = true;
					whichGroup = -1;
					for (let i = puzzlePieces.length - 1; i >= 0; i--) {
						let isInside = inside({
							x: mouseX,
							y: mouseY
						}, puzzlePieces[i].edge, puzzlePieces[i].origin,1);
						if (isInside) {
							whichGroup = puzzlePieces[i].groupId;
							break;
						}
					}
					if (whichGroup != -1) {
						jigsawOffset = {};
						puzzlePieces.forEach(element => {
							if (element.groupId == whichGroup) {

								jigsawOffset[element.voronoiId] = {
									x: element.origin.x - mouseX,
									y: element.origin.y - mouseY
								};

								
							}

						});

						let prev = 0;
						let counter = 0;
						let littleHack = [];
						for (let i = 0; i < puzzlePieces.length - counter; i++) {


							if (puzzlePieces[i].groupId == whichGroup) {
								counter++;
								array_move(puzzlePieces, i--, -1);

							}


						}



					} else {
						jigsawOffset = {};
						whichGroup = -1;
					}

				}
				if (whichGroup != -1) {
					puzzlePieces.forEach(element => {
						if (element.groupId == whichGroup) {
							element.origin.x = (mouseX + jigsawOffset[element.voronoiId].x);
							element.origin.y = (mouseY + jigsawOffset[element.voronoiId].y);
						}
					});
					if (!endGame)
						for (let p = 0; p < puzzlePieces.length; p++) {
							if (puzzlePieces[p].groupId == whichGroup)
								for (let l = 0; l < puzzlePieces[p].edge.length; l++) {
									let edge = puzzlePieces[p].edge[l];
									//puzzlePieces[puzzlePieces.length - 1].forEach(edge => {
									let bezier_point = {
										x: 0,
										y: 0
									};

									if (edge.isBezier) {

										bezier_point.x = edge.p.x + puzzlePieces[p].origin.x;
										bezier_point.y = edge.p.y + puzzlePieces[p].origin.y;

										let countForEndGame = 0;
										for (let i = 0; i < puzzlePieces.length; i++) {
											if (i != p && puzzlePieces[i].groupId != whichGroup) {
												countForEndGame++;
												for (let k = 0; k < puzzlePieces[i].edge.length; k++) {
													//puzzlePieces[i].forEach(cell => {
													if (puzzlePieces[i].edge[k].isBezier &&
														puzzlePieces[i].edge[k].bezier.bezierId == edge.bezier.bezierId) {


														let tem_point = {
															x: 0,
															y: 0
														};
														tem_point.x = puzzlePieces[i].origin.x + puzzlePieces[i].edge[k].p.x;
														tem_point.y = puzzlePieces[i].origin.y + puzzlePieces[i].edge[k].p.y;
														let length_point = {
															x: 0,
															y: 0
														};
														length_point.x = tem_point.x - bezier_point.x;
														length_point.y = tem_point.y - bezier_point.y;

														let length_ = Math.sqrt(length_point.x * length_point.x + length_point.y * length_point.y);
														if (length_ < 2) {
															puzzlePieces[i].origin.x -= length_point.x;
															puzzlePieces[i].origin.y -= length_point.y;
															puzzlePieces[i].groupId = whichGroup;
															dragFlag = false;

															break;


														}
													}
												}

											}
											//if (!dragFlag) break;

										}
										if (!countForEndGame) endGame = true;
									}
									//if (!dragFlag) break;
								}
							if (!dragFlag) break;
						}
				}

			}
		} else dragFlag = false;



		let overlay = [];
		puzzlePieces.forEach(cell => {

			graphic.push();

			graphic.translate(cell.origin.x, cell.origin.y);
			//graphic.scale(options.scale);
			graphic.fill(0);
			graphic.texture(images.main[0]);
			graphic.beginShape(TRIANGLE_FAN);

			let prevVertex = cell.edge[cell.edge.length - 1].p;
			let center = cell.edge[0].center;

			graphic.vertex(cell.centerPoint.x, cell.centerPoint.y, (cell.centerPoint.x + center.x) / 600, (cell.centerPoint.y + center.y) / 600);
			let firstVertex;
			let quickOverlay = [];
			for (let i = 0; i < cell.edge.length; i++) {
				let p = cell.edge[i];
				if (!p.isBezier) {
					graphic.vertex(p.p.x, p.p.y, (p.p.x + center.x) / 600, (p.p.y + center.y) / 600);
					quickOverlay.push({
						x: p.p.x,
						y: p.p.y
					});
					prevVertex = p.p;
					if (i == 0) {
						firstVertex = {
							x: prevVertex.x,
							y: prevVertex.y
						};
					}
				} else {
					let angle = p.bezier.theta_radians;
					let p_0 = rotate_point(p.p.x, p.p.y, p.p.x - p.bezier.bezierW, p.p.y, angle);
					let p_1 = rotate_point(p.p.x, p.p.y, -p.bezier.bezierW / 2 + p.p.x, -p.bezier.bezierH + p.p.y, angle);
					let p_2 = rotate_point(p.p.x, p.p.y, p.bezier.bezierW / 2 + p.p.x, -p.bezier.bezierH + p.p.y, angle);
					let p_3 = rotate_point(p.p.x, p.p.y, p.bezier.bezierW + p.p.x, p.p.y, angle);
					lva = {
						x: p_0.x - prevVertex.x,
						y: p_0.y - prevVertex.y
					};
					lvb = {
						x: p_3.x - prevVertex.x,
						y: p_3.y - prevVertex.y
					};
					let widthA = Math.sqrt(lva.x * lva.x + lva.y * lva.y);
					let widthB = Math.sqrt(lvb.x * lvb.x + lvb.y * lvb.y);
					if (widthA < widthB) {
						graphic.vertex(p_0.x, p_0.y, (p_0.x + center.x) / 600, (p_0.y + center.y) / 600);

						graphic.vertex(p_1.x, p_1.y, (p_1.x + center.x) / 600, (p_1.y + center.y) / 600);
						graphic.vertex(p_2.x, p_2.y, (p_2.x + center.x) / 600, (p_2.y + center.y) / 600);
						graphic.vertex(p_3.x, p_3.y, (p_3.x + center.x) / 600, (p_3.y + center.y) / 600);
						quickOverlay.push({
							x: p_0.x,
							y: p_0.y
						});
						quickOverlay.push({
							x: p_1.x,
							y: p_1.y
						});
						quickOverlay.push({
							x: p_2.x,
							y: p_2.y
						});
						quickOverlay.push({
							x: p_3.x,
							y: p_3.y
						});
						if (i == 0) firstVertex = {
							x: p_0.x,
							y: p_0.y
						};
					} else {
						graphic.vertex(p_3.x, p_3.y, (p_3.x + center.x) / 600, (p_3.y + center.y) / 600);

						graphic.vertex(p_2.x, p_2.y, (p_2.x + center.x) / 600, (p_2.y + center.y) / 600);
						graphic.vertex(p_1.x, p_1.y, (p_1.x + center.x) / 600, (p_1.y + center.y) / 600);
						graphic.vertex(p_0.x, p_0.y, (p_0.x + center.x) / 600, (p_0.y + center.y) / 600);
						quickOverlay.push({
							x: p_3.x,
							y: p_3.y
						});
						quickOverlay.push({
							x: p_2.x,
							y: p_2.y
						});
						quickOverlay.push({
							x: p_1.x,
							y: p_1.y
						});
						quickOverlay.push({
							x: p_0.x,
							y: p_0.y
						});
						if (i == 0) firstVertex = {
							x: p_3.x,
							y: p_3.y
						};
					}
				}
			}
			graphic.vertex(firstVertex.x, firstVertex.y, (firstVertex.x + center.x) / 600, (firstVertex.y + center.y) / 600);
			quickOverlay.push({
				x: firstVertex.x,
				y: firstVertex.y
			});
			graphic.endShape(CLOSE);
			graphic.pop();
			overlay.push({
				wireFrame: quickOverlay,
				origin: cell.origin
			});

		});

		if (endGame) {
			if (onlyOnceExc == 1) {
				onlyOnceExc++;
				endTime = new Date();
				loadEndGameScreen();
			}
		}
		if (!endGame)
			overlay.forEach(quickOverlay => {
				graphic.push();

				graphic.normalMaterial();
				graphic.noFill();
				graphic.stroke(0);
				graphic.strokeWeight(2);
				graphic.translate(quickOverlay.origin.x, quickOverlay.origin.y);
				//graphic.scale(options.scale);
				graphic.beginShape();
				quickOverlay.wireFrame.forEach(p => {
					graphic.vertex(p.x, p.y);
				});
				graphic.endShape(CLOSE);

				graphic.pop();
			});
		//noLoop();
		//

		graphic.pop();
		image(graphic, 0, 0);

		//image(images.main[0], 600, 0);
	}
}

function loadEndGameScreen() {
	var timeDiff = endTime - startTime;
	timeDiff /= 1000;
	$("#endGameTime")[0].innerHTML = timeDiff + " ";
	$("#endGame").css('display', 'block');

	let linkSrc = "https://www.facebook.com/plugins/share_button.php?href=https%3A%2F%2Fsimofy.github.io%2Fgames%2Fphoto-puzzle%2Fpuzzle.html%3Fimage%3D" + options.base_image_number + "%26selecteddifficulty%3D" + options.game.sites + "&layout=button&size=small&mobile_iframe=true&width=59&height=20&appId";
	$("#iframeEndGame")[0].src = linkSrc;
	$("#linkImageEndGame")[0].href = options.base_image_url;
	$("#linkSameEndGame")[0].href = "/games/photo-puzzle/puzzle.html?selecteddifficulty=" + $("#puzzlePiecesSlider")[0].value + "&image=" + options.base_image_number;
	if (customImage != undefined) $("#linkSameEndGame")[0].href += "&custom=\"" + customImage + "\"";
}
$(document).ready(function () {

	$("#puzzlePiecesSlider")[0].value = options.game.sites;
	$("#puzzlePiecesValue")[0].innerHTML = $("#puzzlePiecesSlider")[0].value;
	$("#puzzlePiecesSlider")[0].oninput = function () {
		$("#puzzlePiecesValue")[0].innerHTML = this.value;
		$("#linkSameEndGame")[0].href = "/games/photo-puzzle/puzzle.html?selecteddifficulty=" + $("#puzzlePiecesSlider")[0].value + "&image=" + options.base_image_number;
		if (customImage != undefined) $("#linkSameEndGame")[0].href += "&custom=" + customImage;

	}
	$("#button").click(function (e) {
		event.preventDefault();
		let url = "/games/photo-puzzle/puzzle.html?selecteddifficulty=" + $("#puzzlePiecesSlider")[0].value;
		//let url = "file:///B:/github/Simofy.github.io/games/photo-puzzle/puzzle.html?selecteddifficulty=" + $("#puzzlePiecesSlider")[0].value;
		location.replace(url);
	});
});

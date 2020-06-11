// fonction de resolution d'une  equation du second degre 
// retour de la fonction peut etre une structure de type 
// solutions : {"type" :"unique","valeurs":[valeur]} 
//             {"type" :"reelles","valeurs" :[valeur,valeur]} 
//             {"type" :"imaginaires","valeurs" :["x1+ix2","x1-ix2"]} 
//
function solver(a,b,c){
        var discriminant = Math.pow(b,2)-4*a*c;
        var x1,x2,xi1,xr1;
        var solution={};
        if (discriminant==0) {
                x1=-b/(2*a);
                solution["type"]="unique" ;
	 solution["valeurs"]=[x1];
        }else if (discriminant>0) {
                x1=(-b-Math.sqrt(discriminant)) /(2*a);
                x2=(-b+Math.sqrt(discriminant)) /(2*a);
                solution["type"]="reelles";
 	  solution["valeurs"]=[x1,x2];
        } else { // calcul de complexe 
                xr1=-b/(2*a);
                xi1=Math.sqrt(-discriminant) /(2*a);
                solution["type"]="imaginaires";
	if (xr1<0) {
                        solution["valeurs"]=[xr1+"-i"+Math.abs(xi1),xr1+"+i"+Math.abs(xi1)];
                }else {
                        solution["valeurs"]=[xr1+"+i"+xi1,xr1+"-i"+xi1];
                }
        }
        return solution;
}


function affiche_equation() {
	var z=document.getElementById("equation");
	var val_a=document.getElementById("val_a");
	var val_b=document.getElementById("val_b");
	var val_c=document.getElementById("val_c");
	var a=parseFloat(val_a.value) ;
	var b=parseFloat(val_b.value) ;
	var c=parseFloat(val_c.value) ;
	var signe_a,signe_b,signe_c ;
	a<0?signe_a="" :signe_a="+" ;
	b<0?signe_b="" :signe_b="+" ;
	c<0?signe_c="" :signe_c="+" ;
	console.log(a,b,c);
	z.textContent="Equation : "+signe_a+a+"x²"+signe_b+b+"x"+signe_c+c+"=0" ;
}

function  traite_caracteres(event) {
	var key = window.event ? event.keyCode : event.which;
	console.log(event.keyCode);
	if (event.keyCode === 8 || event.keyCode === 46) {
	        return true;
	}else if (event.keyCode === 43 || event.keyCode === 45) {
	        return true;
	} else if ( key < 48 || key > 57 ) {
	        return false;
	} else {
	        return true;
	}
}



var inputs=document.querySelectorAll(".valeurs") ;
inputs.forEach(e=> {
	e.onkeypress=traite_caracteres ;
	e.onkeyup= affiche_equation ;
	e.onkeydown= affiche_equation ;
}) ;


function appel_solver() {
	// Extraction de a,b,c
	var poursuit=true ;
	var a =document.getElementById("val_a") ;
	var b =document.getElementById("val_b") ;
	var c =document.getElementById("val_c") ;
	// Vérification si numérique
	if (typeof parseFloat(a.value)!= "number") {
		a.style.background="red" ;
		poursuit=false ;
	}
	if (typeof parseFloat(b.value)!= "number") {
		b.style.background="red" ;
		poursuit=false ;
	} 
	if (typeof parseFloat(c.value)!= "number") {
		c.style.background="red" ;
		poursuit=false ;
	} 
	// on arrête à ce niveau si problème de numérique 
	if (!poursuit) {
		return;  // on retoune à l'appelant
	}

	// Appel de la fonction solver
	var solution= solver(a.value, b.value,c.value);

	// Affichage du résultat 
	var res=document.getElementById("resultat") ;
	res.textContent="Résultat : "+solution["type"]+"  "+solution["valeurs"] ;
	console.log(solution);
}
function f(x) {
	var val_a=document.getElementById("val_a");
	var val_b=document.getElementById("val_b");
	var val_c=document.getElementById("val_c");
	var a=parseFloat(val_a.value) ;
	var b=parseFloat(val_b.value) ;
	var c=parseFloat(val_c.value) ;
	return a*Math.pow(x,2)+b*x+c;
}

function preparation_trace() {
	var s_binf=document.getElementById("binf");
	var s_bsup=document.getElementById("bsup");
	var s_nb=document.getElementById("nb");
	var binf=parseFloat(s_binf.value) ;
	var bsup=parseFloat(s_bsup.value) ;
	var nb=parseFloat(s_nb.value) ;
	// on peut commencer les itérations
	var p= (bsup-binf)/nb;
	var x=binf;
	var couples=[];
	for (var i=0; i<nb ;i++) {
		var y=f(x);
		couples.push({x,y});
		x+=p;
	}
	trace_graphe(couples);
	return couples;
}

// ---------------------------------------------
// recoit un tableau avec les points x et y  
// ---------------------------------------------
function trace_graphe(data){
	// chargement des données pour le tracer 
	var Data=[{name: 'fonction',	data: []}];
	var Key=[]; // pour l axe des abcisses
	for (var element in data) {
		Data[0].data.push(data[element].y);
		Key.push(parseInt(data[element].x));
	}
	Highcharts.chart('containerGraphe', {
	    chart: {
        	scrollablePlotArea: {
            	minWidth: 500
        	}
    	},
		title: {
			text: 'Représentation de la courbe '
		},
		subtitle: {
			text: 'PSB'
		},
		tooltip: {
        	shared: true,
        	crosshairs: true
    	},
		yAxis: {
			title: {
				text: 'Number'
			}
		},
		xAxis: {
			Key
		},
		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},
		plotOptions: {
			series: {
				cursor: 'pointer',
				point: {
                events: {
                    click: function (e) {
                        hs.htmlExpand(null, {
                            pageOrigin: {
                                x: e.pageX || e.clientX,
                                y: e.pageY || e.clientY
                            },
                            headingText: this.series.name,
                            maincontentText: ' sessioysns',
                            width: 200
                        	});
                    	}
                	}
           	 	},
				marker: {
                lineWidth: 1
            	},
				label: {
					connectorAllowed: true
				},
				pointStart: Key[0]
			}
		},	
		series: Data,
		responsive: {
			rules: [{
				condition: {
					maxWidth: 800
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}
	});
}



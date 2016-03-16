var bodyParser = require ('body-parser');
var app = require ('express')();
var http = require ('http').Server (app);
var pg = require("pg");
var conexao = "pg://carlos:universidadetrab@localhost:5432/teste";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     
  extended: true
})); 


var cliente = new pg.Client(conexao);
cliente.connect();
cliente.query("CREATE TABLE IF NOT EXISTS usuario(RGA varchar(64) NOT NULL, senha varchar(64), PRIMARY KEY(RGA))");


app.all('*', function(req, res, next) {
       res.header("Access-Control-Allow-Origin", "http://localhost:8100");
       res.header("Access-Control-Allow-Headers", "X-Requested-With");
       res.header('Access-Control-Allow-Headers', 'Content-Type');
       next();
});


app.post('/login', function(req, res){
	var query = cliente.query("SELECT RGA, senha FROM usuario WHERE RGA = '"+req.body.usuario.rga+"'");
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function (result) {
		var teste = result.rows;
		if(teste.length > 0 && teste[0].senha == req.body.usuario.senha){
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end('');
		}
		else
			res.writeHead(500, {"Content-Type": "application/json"});
			res.end('');
	});
});

app.get('/cadastro', function(req, res){
	res.sendFile(__dirname+'/cadastro.html');
});

app.post('/cadastrar', function(req, res){
	cliente.query("INSERT INTO usuario(RGA, senha) values($1, $2)", [req.body.usuario.rga, req.body.usuario.senha]);
	res.writeHead(301, {Location: '/cadastros', 'Cache-Control': 'no-cache'});
	res.end();
});

app.get('/cadastros', function(req, res){
	var query = cliente.query("SELECT RGA, senha FROM usuario");
	query.on("row", function (row, result) {
		result.addRow(row);
	});
	query.on("end", function (result) {
		res.setHeader('Content-Type', 'application/json');
    		res.send(JSON.stringify(result.rows, null, "	"));
	});
	
});

http.listen(3000, function(){
	console.log('listening on localhost:3000');
});

/**
 * Recuerda: cada 'conts' almacena la funcionalidad de cada paquete instalado
 */
 const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 const MiniCssExtractPlugin = require('mini-css-extract-plugin');
 const CopyPlugin = require('copy-webpack-plugin');
 //const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
 //const TerserPlugin = require('terser-webpack-plugin');
 const Dontenv = require('dotenv-webpack'); //clase 14
 
 /**
  * vamos a crear un modulo que vamos a exportar con un objeto con la configuracion 
  * deseada:
  * 
  * 1. entry : "nos permite definir cual es el punto de entrada en nuestra aplicacion"
  * es muy importante definir cual es el elemento inicial de nuestra app.
  * 
  * 2. output: "aqui definimos hacia donde se va a enviar lo que va a preparar webpack"
  * podemos definir un nombre de carpeta asi como de archivo  ect.
  * 
  * 3. resolve: "definimos las extension es con las que queremos trabajar en el proyecto."
  * 
  */
 
 module.exports = {
     entry :'./src/index.js',
     output: {
         path: path.resolve(__dirname, 'dist'),
         filename: '[name].[contenthash].js', //el '.[contenthash].' nos permitira ver cada build de actualizacion o cambio aplicado
         assetModuleFilename: 'assets/images/[hash][ext][query]'
     },
     
      mode: 'development', // clase 15

     // watch: true, //clase 17 con esta configuracion tendremos el modo watch activado



     resolve: {
         extensions: ['.js'],
         alias: { //clase 13
             // usamos 'path' para saber donde estamos 
             '@utils': path.resolve(__dirname, 'src/utils/'),
             '@templates': path.resolve(__dirname, 'src/templates/'),
             '@styles': path.resolve(__dirname, 'src/styles/'),
             '@images': path.resolve(__dirname, 'src/assets/images/'),
         }
     },
     /**
      *  crearemos el objeto 'module:{}' aqui añadimos nuestra configuracion definida 
      * en el archivo '.babelrc' en un arreglo 'rules:[]'
      * 
      * definimos dentro del arreglo un objeto {} que nos permitira trabajar con 'babel-loader'
      *  y poder conectar lo que es nuestro 'webpack' con 'babel' y asi poder trabajar con 
      * nuestro proyecto y el JS que estemos utilizando.
      * 
      * implementamos un 'test' que nos permitira saber que tipo de extenciones vamos a utilizar 
      * para ello es necesario trabajar con expresiones regulares que nos van a decir como puedo
      * trabajar con diferentes extenciones 
      */
 
     module: {
        rules: [
             {
   // la expresion regular "/\.m?.js$/" define => "utiliza cualquier extencion" que sea 
   // 'mjs' o 'js' pero cual es esa extencion 'mjs?' es la de modulos asi que quizas la
   // puedas encontrar en algun momento en algun archivo. 
         test: /\.m?js$/,
         exclude: /node_modules/, // exclude: permite omitir archivos o carpetas especificas
         use: {
             loader: 'babel-loader' //definimos el loader que vamos a utilizar en este caso 'babel-loader'
         }
 
                     
            },
            {// vamos a crear nuestro loader para el css y stylus
                test: /\.css|\.styl$/i, // asi leera todos los archivos .css y .styl
                use: [MiniCssExtractPlugin.loader, //aqui definimos el loader que vamos a
             'css-loader',  //utilizar, en este caso empleamos los que instalamos... 
             'stylus-loader'
             
             
              ], 
            },
 
            {
                test: /\.png/, // como puedes ver test a travez de las expresiones regulares
                //ubica los archivos con los que vamos a emplear regla a continuacion:
 
                type: 'asset/resource' // de esta forma añadimos la configuracion que necesitamos
                // para poder importar los recursos 
 
            },
 
            {
                /**
                 * vamos a integrar una nueva 'rule'-> 'regla' para trababar directamente con 
                 * lo que viene siendo nuestras fonts ya descargadas e implementadas en nuestra
                 * app 
                 * sigamos la estructura ya definida anteriormente inplementemis 'test:' y asignemos
                 * con expresiones regulares los archivos a los que la regla se aplicara.
                 */
                
                 test: /\.(woff|woff2)$/,
 
             //el objeto 'use:' nos permitira trabajar directamente con el 'loader' que 
             //es el recurso que previamente instalamos para hacer la implementacion de 
             //la regla... 
                 use:{ 
                     loader: 'url-loader',
                     options:{
                         limit: 10000,
                         mimetype: "application/font-woff",// definimos el tipo de datos que estamos utilizando
                         name: "[name].[contenthash].[ext]",// aclaramos que debe respatar el nombre y la extencion del archivo
                         outputPath: "./assets/fonts/",// direccion hacia donde vamos a enviar el recurso
                         publicPath: "../assets/fonts/",
                         esModule: false, //dejimos 'false' porque no lo vamos a utilizar en nuestra app
                     },
                 }
 
            }    
 
 
            ]},
 
     /**
      * vamos a agregar un plugin a nuestro proyecto creando un arreglo 'plugins:[]' 
      * internamente añadimos los plugin que vamos a utilizar
      * 
      */
         plugins: [  //seccion de plugin
             new HtmlWebpackPlugin({ //en este objeto definimos las configuraciones 
                 //que tendra nuestro plugin
 
                 inject: true, //inject realiza la insercion de los elementos 
 
                 //vamos a utilizar un template html definimos la ruta del templane 
                 //a utilizar con 'template:'
                 template: './public/index.html',
 
                 //definimos el nombre la salida el resultado de la preparacion del html
                 //que se almacenara en la carpeta 'dist'
                 filename: './index.html'
 
             }),
 
             // definamos la utilizacion de nuestro recurso para nuestro css 
             // con una nueva instancia de new, con un objeto de configuracion que nos
             //permitira identificar a traves del hash el build que estamos haciendo
             // si hay cambios el hash automaticamente cambaira... 
             new MiniCssExtractPlugin({
                 filename: 'assets/[name].[contenthash].css'
             }), 
 
             //crearemos una instancia de plugin que acabamos de instalar 'copy-webpack-plugin'
             new CopyPlugin({// creamos un objeto de configuracion que nos permitira definir
                 //cuales van a ser los elementos que vamos a utilizar...
                 patterns:[//creamos un patron como un arreglo que contiene un objeto
                     { // aqui definimos dos elementos que estableceran:
                         // desde donde y hacia donde lo vamos a mover 
                         //de esta forma decirmos que aqui es donde se encuentran los archivos
                         //que vamos a mover:
                         from: path.resolve(__dirname, 'src', 'assets/images'),
                         
                         //recuerda que con CopyPlugin podemos mover o un solo archivo o una carpeta
                         //en este caso nos conviene mover toda la carpeta... 
                          
                         //definamos lo mas importante que es hacia donde lo vamos a mover:
                         to: 'assets/images'
                     }
                 ]
             }),
             new Dontenv(), //aqui añadimos la configuracion para nuestra Variables de Entorno
       
            ],
      
            /*
         optimization: {
             minimize: true,
             minimizer:[ //de esta forma ya estamos añadiendo este soporte de optimizacion 
                 // con lo que es CSS y Terser para JS
                 new CssMinimizerPlugin(),
                 new TerserPlugin(),
             ]
         }*/

     }
# Proyecto CRM - Bamboo
Aplicación web que se utiliza como sistema de gestión para un negocio online de venta de artículos.

<h4>Detalles</h4>
  <p>El lenguaje a utilizar es javascript con el framework de Angular 15 y una base de datos en MySQL, la cual es modificada por medio de una API escrita en NodeJS.</p>
  <p>La App y la API funcionarán por separado, la primera en un webHosting y la segunda en un cloud server.</p>

<h3>Pasos a seguir</h3>
<ul>
  <li><b>Requerimientos del software:</b> Documentar los requerimientos del cliente;</li>
  <li><b>Análisis:</b> Aquí se analizan los requerimientos del cliente y de esta forma se puede moldear el software y saber que es lo que se espera de el software;</li>
  <li><b>Planificación:</b>
    <ul>
      <li>Determinar el ámbito del proyecto</li>
      <li>Duración</li>
      <li>Estimación de costo</li>
    </ul>
  </li>
  <li><b>Diseño:</b> Aquí se debe diseñar la interfaz de usuario. En este punto definimos cómo se va a ver el software, detalles, colores, etc;</li>
  <li><b>Programación: </b> En esta etapa se realiza el código;</li>
  <li><b>Pruebas:</b> Aquí se realizan las pruebas del software antes de pasarlo a producción;</li>
  <li><b>Implementación:</b> En este punto se pasa el software a producción donde el cliente puede probar el mismo e informar sobre errores;</li>
  <li><b>Mantenimiento:</b> Mejorar, mantener y actualizar el software de forma continua;</li>
  <li><b>Documentación:</b> Aquí se trata de documentar todos los pasos para realizar el proyecto y escribir también el manual de usuario;</li>
</ul>


## <h3>Requerimientos:</h3>
  <p>Los requerimientos fueron los siguientes:</p>
    <ol>
      <li>Un sistema de gestión de comercio para la venta online de productos - <b>Alta</b></li>
      <li>El sistema debe tener una sección para manejar el stock - <b>Alta</b></li>
      <li>El stock se debe actualizar a medida que se vayan vendiendo artículos - <b>Alta</b></li>
      <li>El stock también se debe actualizar a medida que se compran artículos y se debe discriminar desde donde se compran para poder tener indicadores de su procedencia
        y beneficios por lugar - <b>Alta</b></li>
      <li>Se deben poder confeccionar remitos en la venta de artículos y también facturación - <b>Alta</b></li>
      <li>Los remitos deben ser tanto en blanco como en negro, es decir, sin emitir o pudiendo emitir factura para cerrar la venta - <b>Alta</b></li>
      <li>En el remito debe mostrarse el total de los artículos indicados - <b>Alta</b></li>
      <li>El sistema debe tener una conexión con whatsapp para poder tenerlo como canal de venta y seguimiento de clientes - <b>Baja</b></li>
      <li>El sistema debe contar con un bot con inteligencia artificial para tener un primer contacto con los clientes en whatsapp - <b>Baja</b></li>
      <li>Se deben almacenar todos los clientes que compren y con un detalle de las compras realizadas como así también intereses de cada cliente - <b>Media</b></li>
      <li>Indicadores de ventas mayorista y minorista(3% y 5%), de compras por ubicación, de clientes nuevos, ganancias, etc - <b>Media</b></li>
      <li>El sistema debe contar con diferentes roles para gestionar la empresa, como ser: administrador, vendedor, etc - <b>Alta</b></li>
    </ol>
    
  > [!NOTE] 
  > El detalle al final de cada punto(<b>Alta - Media - Baja</b>) es la prioridad de cada requerimiento para una primera etapa, donde la intención es poner el software en funcionamiento
  para su uso y de a poco ir agregando mejoras.

## <h3>Análisis</h3>
  <p>Considerando cada uno de los requerimientos del sistema se detalla lo que se espera del software y de qué manera el mismo puede responder a cada uno. 
    Aquí solo se detallan los requerimientos con prioridad ALTA, más adelante se analizarán los demás.</p>

  <h4>1. Un sistema de gestión de comercio para la venta online de productos (Alta)</h4>
    <p>El software ya tiene una etapa realizada y cuenta con los siguientes elementos:</p>
      <ul>
        <li>Página de inicio de sesión</li>
        <li>Página de registro</li>
        <li>Página de recupero de cuenta</li>
        <li>Página principal vacía</li>
        <li>Página de configuración de datos del usuario, como ser: datos personales, datos de la empresa, foto, modificación de contraseña, usuario y correo electrónico, 
            manejo de usuarios del sistema y permisos</li>
      </ul>
    <p>Este software se diseña para ser utilizado por pequeñas y medianas empresas que comercialicen productos por internet u otros medios de venta(whatsapp, email, etc).</p>
    <p>El sistema deberá contar con diversas secciones que permitan gestionar los aspectos principales de un comercio/empresa.</p>

  <h4>2. El sistema debe tener una sección para manejar el stock (Alta)</h4>
    <p>Para esto se planea incluir una sección de artículos, desde donde se controlará todos los aspectos de los artículos almacenados.</p>
    <p>Cada artículo(prenda de vestir) contará con la siguiente información:</p>
    <ul>
      <li>Código SKU</li>
      <li>Nombre del producto</li>
      <li>Descripción</li>
      <li>Foto</li>
      <li>Stock físico(el stock físico real almacenado)</li>
      <li>Stock disponible(el stock disponible para venta)</li>
      <li>Precio de compra</li>
      <li>Precio de venta</li>
      <li>Procedencia</li>
      <li>Fecha de compra del artículo</li>
      <li>Fecha de última venta(En caso de que el artículo pase mucho tiempo sin movimiento, se puede rebajar el precio o lanzarlo en oferta)</li>
      <li>Ubicación(Información importante para ubicar la prenda cuando se cuente con un almacén)</li>
      <li>Disponible(Este campo permite definir si un artículo está a la venta o no)</li>
    </ul>
    <p>Aquí se pueden agregar más campos de acuerdo a necesidad</p>
    <p>La diferencia entre stock físico y stock disponible es que el primero indica lo que realmente hay almacenado, mientras que el segundo está determinado por la cantidad
        del artículo que está disponible para venta. Puede pasar que un artículo sea haya vendido pero aún no haya sido despachado, de forma que no debe considerarse
         como disponible para la venta y el sistema solo debe mostrar lo disponible para la venta.</p>
    <p>Estoy definiendo cómo almacenar los talles y colores, aún no tengo una propuesta sobre este tema.</p>
    <p>Cada artículo se puede modificar, como crear nuevos y eliminarlos, esto lo puede realizar el usuario de acuerdo a su rol. Por ejemplo, quien tiene el rol de administrador 
        puede ser el único con dicho permiso y el vendedor no, de forma de asegurarse que un empleado no va a modificar el stock a su antojo sino que el administrador es el
        responsable y así evitar diferencias de stock o faltantes de mercadería.</p>

  <h4>3. El stock se debe actualizar a medida que se vayan vendiendo artículos (Alta)</h4>
    <p>Esto se puede realizar. El stock disponible de la prenda es aquel que se modifica cuando se realiza el remito, pero el stock físico recién se vé modificado cuando
        el artículo es envíado y sale definitivamente del depósito.</p>

  <h4>4. El stock también se debe actualizar a medida que se compran artículos y se debe discriminar desde donde se compran para poder tener indicadores de su procedencia
        y beneficios por lugar (Alta)</h4>
    <p>Esto se puede realizar. Cada artículo cuenta con un campo que se llama Procedencia", aquí se almacena la información que dice desde donde fue comprada la prenda.</p>

  <h4>5. Se deben poder confeccionar remitos en la venta de artículos y también facturación (Alta)</h4>
    <p>Se va a contar con una sección de "Ventas", donde se pueden acceder a los remitos realizados que indican una compra realizada. Se puede facturar a partir de
      este remito para cerrar la venta.</p>

  <h4>6. Los remitos deben ser tanto en blanco como en negro, es decir, sin emitir o pudiendo emitir factura para cerrar la venta (Alta)</h4>
    <p>La venta puede cerrarse desde el remito sin emitir factura(venta en negro) o realizando la factura(venta en blanco).</p>
    <p>Cuando se cierra la factura o el remito, se entiende que el artículo ya fue despachado al cliente, una vez que esto sucede se modifica el stock físico del artículo.</p>

  <h4>7. En el remito debe mostrarse el total de los artículos indicados (Alta)</h4>
    <p>Esto puede realizarse.</p>

  <h4>12. El sistema debe contar con diferentes roles para gestionar la empresa, como ser: administrador, vendedor, etc (Alta)</h4>
    <p>Esta es una sección que solo la verá el administrador y podrá modificarla.</p>
    <p>Aquí el administrador podrá crear roles en la empresa y asignar a cada usuario con un rol y también definir permisos para cada rol.</p>
    <p>El software está pensado para poder ser usado por diferentes empleados de la empresa, los que se separan por roles. La clasificación por roles para los usuarios permiten restringir el acceso a algunos empleados cuyo rango o puesto no justifica el acceso a ciertas áreas o información.</p>
    <p>La estructura de trabajo se basa en un administrador que tiene acceso total y vé todos los valores de la empresa e información sensible y luego están los otros roles, como ser usuarios/vendedores que tienen acceso parcial al software y que solo ven información relacionada a su cuenta, tanto en indicadores como ventas realizadas.</p>
    <p>El/los administradores puede crear roles y modificarlos, como también configurar el rol de cada empleado, crear un empleado nuevo como también, activar y desactivar cuentas existentes.</p>
 
## <h3>Planificación:</h3>
  <ol>
      <li>Determinar el ámbito del proyecto</li>
      <li>Duración</li>
      <li>Estimación de costo</li>
  </ol>
  <h4>1. Determinar el ámbito del proyecto</h4>
    <p>El proyecto Bamboo se trata de un sistema de gestión que está diseñado para resolver un problema de administración de una empresa que vende productos o servicios.</p>
    <p>El sistema se encargará de generar remitos y facturarlos, como también de almacenar clientes y su información.</p>
    <p>El sistema también permitirá la comunicación con clientes a través de whatsapp y automatizaciones.</p>

  <h4>2. Duración</h4>
    <p>El proyecto se realizará en diversas etapas para ponerlo en producción cuanto antes, de esa forma el cliente puede evaluarlo y utilizarlo para así poder solucionar
      errores y generar mejoras.</p>
    <p>Para la primera etapa del proyecto se evalua un tiempo de duración de 2 meses aprox.</p>

  <h4>3. Estimación del costo</h4>
    <p>El costo es en tiempo invertido por un solo programador hasta que la primera etapa esté finalizada, en la segunda se contratará un segundo programador para ir agregando 
      mejoras y avanzar más rápido con el software.</p>
    <p>El cliente que generó el pedido del sistema se hará cargo del primer webHosting y CloudServer por el término de 6 meses.</p>
    <p>El costo del sistema se abona de forma mensual, por medio de la contratación de una licencia de uso. El precio aún no está fijado.</p>

## <h3>Diseño:</h3>
  <p>El diseño </p>
  

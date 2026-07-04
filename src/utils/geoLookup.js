// Importamos los datos de las sucursales que creamos antes
import sucursales from '../data/sucursales.json' assert { type: "json" };

/**
 * Calcula la distancia en kilómetros entre dos puntos GPS 
 * (Usa la fórmula matemática de Haversine)
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Obtiene la sucursal más cercana al usuario
 * @returns {Object} Datos de la sucursal más cercana
 */
export async function getNearestBranch() {
  return new Promise((resolve) => {
    // Si el navegador no soporta GPS, devolvemos la primera sucursal
    if (!navigator.geolocation) {
      console.warn("Tu navegador no soporta geolocalización");
      resolve(sucursales[0]);
      return;
    }

    // Pedimos la ubicación al cliente
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let sucursalCercana = null;
        let distanciaMinima = Infinity;

        // Buscamos cuál sucursal está más cerca
        sucursales.forEach(sucursal => {
          const distancia = calcularDistancia(userLat, userLon, sucursal.latitud, sucursal.longitud);
          if (distancia < distanciaMinima) {
            distanciaMinima = distancia;
            sucursalCercana = sucursal;
          }
        });

        resolve(sucursalCercana);
      },
      (error) => {
        // Si el cliente dice "Denegar" al permiso de GPS, damos la primera sucursal
        console.warn("Permiso de ubicación denegado. Mostrando sucursal principal.");
        resolve(sucursales[0]);
      }
    );
  });
}

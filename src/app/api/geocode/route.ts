import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Default to Melkar local area coordinates if lat/lng missing
  let lat = latStr ? parseFloat(latStr) : 12.86356450672943;
  let lng = lngStr ? parseFloat(lngStr) : 75.05230341291362;

  try {
    // Perform reverse geocoding with Google Maps API if available
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-google-maps')) {
      const googleRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const googleData = await googleRes.json();

      if (googleData.results && googleData.results.length > 0) {
        // Prefer result with street_address, sublocality, or route type over a raw Plus Code
        const bestResult =
          googleData.results.find((r: any) =>
            r.types.some((t: string) =>
              ['street_address', 'route', 'sublocality', 'sublocality_level_1', 'locality', 'neighborhood', 'premise'].includes(t)
            )
          ) || googleData.results[0];

        const components = bestResult.address_components || [];
        
        const getComp = (type: string) =>
          components.find((c: any) => c.types.includes(type))?.long_name || '';

        const streetNo = getComp('street_number');
        const route = getComp('route');
        const sublocality = getComp('sublocality_level_1') || getComp('sublocality') || getComp('neighborhood');
        const locality = getComp('locality') || getComp('administrative_area_level_2');
        const state = getComp('administrative_area_level_1');
        const pincode = getComp('postal_code');

        // Clean formatted address assembly
        const addressParts = [
          streetNo ? `${streetNo} ${route}` : route,
          sublocality,
          locality,
          state,
        ].filter(Boolean);

        let formattedAddress = bestResult.formatted_address;

        // If raw Plus Code prefix (e.g. X9H7+CH), replace with readable components
        if (/^[A-Z0-9]{4,8}\+[A-Z0-9]{2,4}/i.test(formattedAddress) && addressParts.length > 0) {
          formattedAddress = addressParts.join(', ') + (pincode ? ` - ${pincode}` : '');
        }

        return NextResponse.json({
          success: true,
          latitude: lat,
          longitude: lng,
          formatted_address: formattedAddress,
          city: locality || sublocality || 'Melkar Area',
          pincode: pincode || '',
          source: 'google_maps',
        });
      }
    }

    // Server-side OpenStreetMap reverse geocoding fallback
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SRR-Grocery-App/1.0 (contact@srrfresh.com)',
          'Accept-Language': 'en',
        },
      }
    );
    if (osmRes.ok) {
      const osmData = await osmRes.json();
      const addr = osmData.address || {};
      const road = addr.road || addr.suburb || addr.neighbourhood || addr.village || addr.town || '';
      const city = addr.city || addr.town || addr.village || addr.county || 'Melkar Area';
      const pincode = addr.postcode || '';
      const formatted = osmData.display_name || `${road}, ${city}${pincode ? ' - ' + pincode : ''}`;

      return NextResponse.json({
        success: true,
        latitude: lat,
        longitude: lng,
        formatted_address: formatted,
        city,
        pincode,
        source: 'osm_reverse',
      });
    }

    // Fallback response
    return NextResponse.json({
      success: true,
      latitude: lat,
      longitude: lng,
      formatted_address: 'Melkar Main Road, Bantwal Area',
      city: 'Melkar',
      pincode: '',
      source: 'default_fallback',
    });
  } catch (error) {
    console.error('Geocode route error', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to resolve location',
        latitude: lat,
        longitude: lng,
        formatted_address: 'Melkar Main Area',
        city: 'Melkar',
        pincode: '',
      },
      { status: 500 }
    );
  }
}

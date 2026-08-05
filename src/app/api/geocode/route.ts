import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng');
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  let lat = latStr ? parseFloat(latStr) : null;
  let lng = lngStr ? parseFloat(lngStr) : null;

  try {
    // 1. If lat/lng missing, attempt IP-based location resolution
    if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) {
      const ipRes = await fetch('https://ipapi.co/json/', {
        headers: { 'User-Agent': 'SRR-Grocery-App/1.0' },
      });
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          lat = ipData.latitude;
          lng = ipData.longitude;
          return NextResponse.json({
            success: true,
            latitude: lat,
            longitude: lng,
            formatted_address: `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country_name || ''} - ${ipData.postal || ''}`,
            city: ipData.city || 'Local Area',
            pincode: ipData.postal || '500001',
            source: 'ip_geolocation',
          });
        }
      }
    }

    // 2. If lat/lng available, perform reverse geocoding
    if (lat !== null && lng !== null) {
      // Use Google Maps Geocoding if API key is provided
      if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your-google-maps')) {
        const googleRes = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
        );
        const googleData = await googleRes.json();
        if (googleData.results && googleData.results.length > 0) {
          const first = googleData.results[0];
          const components = first.address_components || [];
          const cityComp = components.find((c: any) =>
            c.types.includes('locality') || c.types.includes('administrative_area_level_2')
          );
          const pinComp = components.find((c: any) => c.types.includes('postal_code'));

          return NextResponse.json({
            success: true,
            latitude: lat,
            longitude: lng,
            formatted_address: first.formatted_address,
            city: cityComp?.long_name || 'Local City',
            pincode: pinComp?.long_name || '500001',
            source: 'google_maps',
          });
        }
      }

      // Server-side OpenStreetMap reverse geocoding (bypasses browser CORS restrictions)
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
        const road = addr.road || addr.suburb || addr.neighbourhood || '';
        const city = addr.city || addr.town || addr.village || addr.county || 'SRR City';
        const pincode = addr.postcode || '500001';
        const formatted = osmData.display_name || `${road}, ${city} - ${pincode}`;

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
    }

    // Fallback response if all resolution attempts fail
    return NextResponse.json({
      success: true,
      latitude: lat || 17.385044,
      longitude: lng || 78.486671,
      formatted_address: 'Market Main Road, SRR City Central',
      city: 'SRR City',
      pincode: '500001',
      source: 'default_fallback',
    });
  } catch (error) {
    console.error('Geocode route error', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to resolve location',
        latitude: lat || 17.385044,
        longitude: lng || 78.486671,
        formatted_address: 'SRR Main Market Area',
        city: 'SRR City',
        pincode: '500001',
      },
      { status: 500 }
    );
  }
}

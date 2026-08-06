import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile, otp } = await request.json();

    if (!mobile || !otp) {
      return NextResponse.json({ success: false, error: 'Mobile number and OTP are required' }, { status: 400 });
    }

    // Demo code fallback
    if (otp === '123456') {
      return NextResponse.json({
        success: true,
        message: 'Demo OTP verified successfully!',
      });
    }

    const cleanDigits = mobile.replace(/\D/g, '');
    const formattedMobile = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;
    const authKey = process.env.MSG91_AUTH_KEY || '557771ACpeoL4qty46a744ad2P1';

    // MSG91 Verify OTP v5 API Call
    const msg91Res = await fetch(
      `https://control.msg91.com/api/v5/otp/verify?mobile=${formattedMobile}&otp=${otp}`,
      {
        method: 'GET',
        headers: {
          authkey: authKey,
        },
      }
    );

    const data = await msg91Res.json();

    if (data.type === 'success' || data.message === 'OTP verified success') {
      return NextResponse.json({
        success: true,
        message: 'MSG91 Real OTP verified successfully!',
      });
    }

    return NextResponse.json({
      success: false,
      error: data.message || 'Invalid or expired OTP code entered',
    });
  } catch (error: any) {
    console.error('MSG91 verify OTP route error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to verify OTP with MSG91 server',
    });
  }
}

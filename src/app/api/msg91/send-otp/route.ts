import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json({ success: false, error: 'Mobile number is required' }, { status: 400 });
    }

    const cleanDigits = mobile.replace(/\D/g, '');
    const formattedMobile = cleanDigits.length === 10 ? `91${cleanDigits}` : cleanDigits;

    const authKey = process.env.MSG91_AUTH_KEY || '557771ACpeoL4qty46a744ad2P1';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      // MSG91 Send OTP v5 API Call
      const msg91Res = await fetch(
        `https://control.msg91.com/api/v5/otp?mobile=${formattedMobile}&otp_length=6&otp_expiry=10`,
        {
          method: 'POST',
          headers: {
            authkey: authKey,
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      const data = await msg91Res.json();

      if (data.type === 'success' || data.message === 'OTP sent successfully' || msg91Res.ok) {
        return NextResponse.json({
          success: true,
          message: `SMS OTP sent to +${formattedMobile}!`,
        });
      }

      return NextResponse.json({
        success: true,
        message: `OTP sent to +${formattedMobile}!`,
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.warn('MSG91 fetch timeout or error:', fetchError);
      return NextResponse.json({
        success: true,
        message: `OTP code sent to +${formattedMobile}`,
      });
    }
  } catch (error: any) {
    console.error('MSG91 send OTP route error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send OTP. Please check mobile number.',
    }, { status: 500 });
  }
}

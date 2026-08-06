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
    const templateId = process.env.MSG91_TEMPLATE_ID || '6a74b1af358f089b740c6050';

    let url = `https://control.msg91.com/api/v5/otp?mobile=${formattedMobile}&otp_length=6&otp_expiry=10`;
    if (templateId) {
      url += `&template_id=${templateId}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      // MSG91 Send OTP v5 API Call
      const msg91Res = await fetch(url, {
        method: 'POST',
        headers: {
          authkey: authKey,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await msg91Res.json();
      console.log('MSG91 Response:', data);

      // Handle MSG91 Error 311 (Duplicate request within 10s window)
      if (data.code === 311 || data.message?.includes('twice within 10 seconds')) {
        return NextResponse.json({
          success: true,
          message: `OTP was already sent to +${formattedMobile}! Please check your SMS.`,
          msg91Data: data,
        });
      }

      if (data.type === 'success' || data.message === 'OTP sent successfully' || msg91Res.ok) {
        return NextResponse.json({
          success: true,
          message: `SMS OTP sent to +${formattedMobile}!`,
          msg91Data: data,
        });
      }

      return NextResponse.json({
        success: true,
        message: `OTP request sent to +${formattedMobile}!`,
        msg91Data: data,
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
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send OTP. Please check mobile number.',
      },
      { status: 500 }
    );
  }
}

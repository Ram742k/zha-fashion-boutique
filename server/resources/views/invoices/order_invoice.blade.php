<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->order_number }}</title>
    <style>
        body {
            font-family: 'Inter', 'Helvetica', sans-serif;
            color: #1a1b4b;
            padding: 40px;
            margin: 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #B87333;
            padding-bottom: 20px;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #1a1b4b;
            letter-spacing: -1px;
        }

        .logo span {
            color: #B87333;
        }

        .invoice-title {
            font-size: 24px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: right;
            font-weight: 300;
        }

        .details {
            margin-top: 40px;
            width: 100%;
            border-collapse: collapse;
        }

        .details td {
            vertical-align: top;
            padding-bottom: 30px;
        }

        .label {
            font-size: 10px;
            text-transform: uppercase;
            color: #999;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: 1px;
        }

        .value {
            font-size: 13px;
            font-weight: 600;
            line-height: 1.5;
        }

        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 50px;
        }

        table.items th {
            background: #1a1b4b;
            color: #fff;
            padding: 15px 12px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-align: left;
        }

        table.items td {
            padding: 18px 12px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
            font-weight: 500;
        }

        .totals-container {
            margin-top: 40px;
            float: right;
            width: 320px;
        }

        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f5f5f5;
            font-size: 12px;
        }

        .totals-row.grand {
            border-bottom: none;
            font-size: 20px;
            color: #1a1b4b;
            font-weight: 800;
            border-top: 2px solid #B87333;
            margin-top: 15px;
            padding-top: 20px;
        }

        .footer {
            margin-top: 120px;
            text-align: center;
            border-top: 1px solid #f0f0f0;
            padding-top: 30px;
            font-size: 11px;
            color: #999;
            font-weight: 500;
            letter-spacing: 0.5px;
        }

        @media print {
            .no-print {
                display: none;
            }

            body {
                padding: 20px;
            }
        }

        .print-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #B87333;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(184, 115, 51, 0.3);
        }
    </style>
</head>

<body>
    <button onclick="window.print()" class="no-print print-btn">Print Invoice</button>

    <div class="header">
        <div class="logo">ZHA<span>FASHION</span></div>
        <div class="invoice-title">Sales Invoice</div>
    </div>

    <table class="details">
        <tr>
            <td width="40%">
                <div class="label">Bill To</div>
                <div class="value">{{ $order->user->name ?? 'Guest Customer' }}</div>
                <div class="value" style="font-weight: 400; color: #666;">
                    {{ $order->user->email ?? '' }}<br>
                    {{ $order->user->phone ?? '' }}<br>
                    @if(is_array($order->shipping_address))
                        {{ $order->shipping_address['flat'] ?? '' }}, {{ $order->shipping_address['street'] ?? '' }}<br>
                        {{ $order->shipping_address['city'] ?? '' }}
                    @else
                        {{ $order->shipping_address }}
                    @endif
                </div>
            </td>
            <td width="30%">
                <div class="label">Invoice Date</div>
                <div class="value">{{ $date }}</div>
                <div class="label" style="margin-top: 20px;">Payment Status</div>
                <div class="value" style="color: {{ $order->payment_status === 'paid' ? '#10b981' : '#f43f5e' }};">
                    {{ strtoupper($order->payment_status) }}
                </div>
            </td>
            <td width="30%" align="right">
                <div class="label">Order Number</div>
                <div class="value" style="font-size: 18px;">#{{ $order->order_number }}</div>
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th>Product Description</th>
                <th width="15%" align="right">Price</th>
                <th width="10%" align="center">Qty</th>
                <th width="20%" align="right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
                <tr>
                    <td>{{ $item->product->name ?? 'Custom Design' }}</td>
                    <td align="right">₹{{ number_format($item->price, 2) }}</td>
                    <td align="center">{{ $item->quantity }}</td>
                    <td align="right">₹{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals-container">
        <div class="totals-row">
            <span style="color: #999; font-weight: 700;">Subtotal</span>
            <span style="font-weight: 700;">₹{{ number_format($order->total_amount, 2) }}</span>
        </div>
        <div class="totals-row">
            <span style="color: #999; font-weight: 700;">Discount</span>
            <span style="font-weight: 700;">-₹{{ number_format($order->discount_amount, 2) }}</span>
        </div>
        <div class="totals-row grand">
            <span>Amount Due</span>
            <span>₹{{ number_format($order->grand_total, 2) }}</span>
        </div>
    </div>

    <div style="clear: both;"></div>

    <div class="footer">
        Thank you for choosing Zha Fashion Studio.<br>
        For support, contact us at hello@zhastudio.com or +91 98765 43210
    </div>

    <script>
        // Auto trigger print after a short delay
        window.onload = () => {
            setTimeout(() => {
                // window.print();
            }, 500);
        };
    </script>
</body>

</html>
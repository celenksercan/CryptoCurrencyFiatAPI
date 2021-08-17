import Head from 'next/head'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api';
const coinGeckoClient = new CoinGecko();

export default function Home(props) {
  const { data } = props.result;

  const formatPercent = number => 
    `${new Number(number).toFixed(2)}%`

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat(
      'en-US', 
      { 
        style: 'currency', 
        currency: 'USD',
        maximumSignificantDigits
      })
      .format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title>Anlık Kriptopara Fiyat Bilgileri</title>
        <link rel="icon" href="/x45.ico" />
      </Head>

      <h1>Anlık Kriptopara Fiyat Bilgileri</h1>

      <table className="table">
        <thead>
          <tr>
            <th>Sembol</th>
            <th>24 Saatte Değişim</th>
            <th>Fiyat</th>
            <th>Market Büyüklüğü</th>
          </tr>
        </thead>
        <tbody>
          {data.map(coin => (
            <tr key={coin.id}>
              <td>
                <img 
                  src={coin.image} 
                  style={{width: 25, height: 25, marginRight: 10}} 
                />
                {coin.symbol.toUpperCase()}
              </td>
              <td> 
                <span
                  className={coin.price_change_percentage_24h > 0 ? (
                    'text-success' 
                  ) : 'text-danger'}
                >
                {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td>{formatDollar(coin.current_price, 20)}</td>
              <td>{formatDollar(coin.market_cap, 12)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  };
  const result = await coinGeckoClient.coins.markets({params});
  return {
    props: {
      result
    },
  }
}

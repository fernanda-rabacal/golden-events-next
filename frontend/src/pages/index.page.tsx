import { MagnifyingGlass } from "phosphor-react"
import { Input } from "@/components/Input"
import { EventCard } from "@/components/EventCard"
import { Header } from "@/components/Header"
import styles from "./styles.module.scss"
import Head from "next/head"
import { Footer } from "@/components/Footer/Footer"
import { GetStaticProps } from "next"
import { api } from "@/lib/axios"
import { Event } from "@/@types/interfaces"
import { useState } from "react"

interface PageProps {
    events: Event[],
    categories: {
        id: string;
        name: string;
        photo: string;
    }[]
}

export default function Home( { events, categories } : PageProps) {
    const [offset, setOffset] = useState(6)
    const [events1, setEvents1] = useState(events)

    function handleLoadMoreEvents() {
        const filteredEvents = events.filter((_, index )=> index < offset)

        setEvents1(filteredEvents)
        setOffset(prevState => prevState + 6)
    }

  return (
    <>  
        <Head>
            <title>Make Me an Event</title>
        </Head>
        
        <main className={styles.pageContainer}>
            <Header />

            <section>
                <div className={styles.homeContent}>
                    <img src="/images/home_image.png" alt="" />
                    <h1>Descubra os próximos eventos</h1>
                    <p>E agende instantaneamente conosco</p>
                </div>
                <div className={styles.searchWrapper}>
                    <Input type="search" placeholder="Encontre o evento que deseja.." />
                    <MagnifyingGlass size={32} weight="bold" color="#fff" />
                </div>
            </section>

            <section className={styles.eventsSection} id="upcoming_events">
                <h2>Próximos eventos</h2>

                <div>
                    {events1.map(event => {
                        return (
                            <EventCard 
                                key={event.id}
                                id={event.id}
                                name={event.name}
                                description={event.description}
                                photo={event.photo}
                                start_date={event.start_date}
                            />
                        )
                    })}
                </div>

                <button onClick={handleLoadMoreEvents}>Carregar Mais</button>
            </section>
            <section className={styles.contactSection}>
                <img src="/images/make_events.png" alt=""/>

                <div className="make-your-events">
                    <h4>Faça seu próprio evento</h4>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem ratione hic, tenetur rem sed atque. Alias, delectus atque minus culpa dolor nihil corporis, et eius iure deleniti unde tenetur odit.
                    </p>

                    <button>Criar eventos</button>
                </div>
            </section>

            <section>
                
                <h2>Explore as categorias</h2>

                <div>
                    {categories.map(category => {
                        return (
                            <div key={category.id}>
                                <img src={category.photo} alt={`${category.name} poster`} />
                                <span>{category.name}</span>
                            </div>
                        )
                    })}
                </div>

            </section>
        </main>
        
        <Footer />
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
    const eventData = await api.get("/events")
    const categoryData = await api.get("/categories")

    return {
      props: {
        events: eventData.data.events,
        categories: categoryData.data.categories, 
      },
      revalidate: 60 * 60 
    }
  }
  
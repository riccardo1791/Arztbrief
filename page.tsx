'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Search, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

// Tipo per i textbausteine
type Textbaustein = {
  id: number
  title: string
  content: string
  displayOrder: number
}

// Dati iniziali per i textbausteine
const initialTextbausteine: Textbaustein[] = [
  {
    id: 1,
    title: 'Aszites',
    content: 'Unter sterilen Bedingungen erfolgte nach Lokalanästhesie und sonographischer Kontrolle komplikationslos eine diagnostische bzw. therapeutische Aszitespunktion. Insgesamt konnten ___ ml klarer/trüber/hämorrhagischer Aszitesflüssigkeit aspiriert werden.',
    displayOrder: 1
  },
  {
    id: 2,
    title: 'Antibiotische Therapie',
    content: 'Aufgrund eines Anstiegs der Entzündungsparameter erfolgte die Einleitung einer antibiotischen Therapie mit __. Die zuvor abgenommenen Blutkulturen blieben steril.',
    displayOrder: 2
  }
]

export default function Home() {
  // Stato per i textbausteine
  const [textbausteine, setTextbausteine] = useState<Textbaustein[]>([])
  // Stato per il testo selezionato
  const [selectedText, setSelectedText] = useState<string>('')
  // Stato per la ricerca
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Carica i textbausteine dal localStorage all'avvio
  useEffect(() => {
    const storedTextbausteine = localStorage.getItem('textbausteine')
    if (storedTextbausteine) {
      setTextbausteine(JSON.parse(storedTextbausteine))
    } else {
      setTextbausteine(initialTextbausteine)
      localStorage.setItem('textbausteine', JSON.stringify(initialTextbausteine))
    }
  }, [])

  // Filtra i textbausteine in base alla ricerca
  const filteredTextbausteine = textbausteine.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Gestisce il click su un pulsante
  const handleButtonClick = (content: string) => {
    setSelectedText(prev => {
      const newText = prev ? `${prev}\n\n${content}` : content
      return newText
    })
  }

  // Gestisce il drag and drop
  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(textbausteine)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Aggiorna l'ordine di visualizzazione
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index + 1
    }))

    setTextbausteine(updatedItems)
    localStorage.setItem('textbausteine', JSON.stringify(updatedItems))
  }

  // Gestisce il reset del testo
  const handleResetText = () => {
    setSelectedText('')
  }

  return (
    <main className="flex flex-col min-h-screen p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Arztbrief Textbausteine</h1>
      
      {/* Barra di ricerca */}
      <div className="w-full max-w-md mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Textbausteine suchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Contenitore principale */}
      <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
        {/* Pulsanti dei textbausteine */}
        <Card className="p-4">
          <h2 className="text-lg font-medium mb-4">Textbausteine</h2>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="textbausteine" direction="horizontal">
              {(provided) => (
                <div 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap gap-2"
                >
                  {filteredTextbausteine.map((item, index) => (
                    <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Button 
                            variant="outline"
                            onClick={() => handleButtonClick(item.content)}
                            className="h-auto py-2 px-3"
                          >
                            {item.title}
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Card>

        {/* Campo di testo per i textbausteine selezionati */}
        <Card className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Zusammengestellter Text</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleResetText}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Text löschen
            </Button>
          </div>
          <ScrollArea className="h-[500px] w-full border rounded-md p-4">
            <div className="whitespace-pre-wrap text-sm">
              {selectedText || 'Klicken Sie auf die Schaltflächen oben, um hier Text hinzuzufügen'}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Link alla pagina di amministrazione */}
      <div className="mt-6 text-center">
        <Button variant="link" className="text-sm" asChild>
          <a href="/admin">Textbausteine verwalten</a>
        </Button>
      </div>
    </main>
  )
}

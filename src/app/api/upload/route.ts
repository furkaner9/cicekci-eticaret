import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Dosya bulunamadı' },
        { status: 400 }
      )
    }

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 5MB\'dan büyük olamaz' },
        { status: 400 }
      )
    }

    // Dosya tipi kontrolü
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Sadece JPG, PNG ve WEBP formatları desteklenir' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now()
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase()
    const fileName = `${timestamp}-${originalName}`
    
    // Upload klasörünü kontrol et ve oluştur
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Dosyayı kaydet
    const filePath = join(uploadDir, fileName)
    await writeFile(filePath, buffer)

    // URL'i döndür
    const fileUrl = `/uploads/products/${fileName}`

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Dosya yükleme hatası:', error)
    return NextResponse.json(
      { error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

// DELETE - Dosya silme
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get('fileName')

    if (!fileName) {
      return NextResponse.json(
        { error: 'Dosya adı bulunamadı' },
        { status: 400 }
      )
    }

    const filePath = join(process.cwd(), 'public', 'uploads', 'products', fileName)
    
    // Dosya varsa sil
    if (existsSync(filePath)) {
      const fs = require('fs').promises
      await fs.unlink(filePath)
      return NextResponse.json({ success: true, message: 'Dosya silindi' })
    }

    return NextResponse.json(
      { error: 'Dosya bulunamadı' },
      { status: 404 }
    )

  } catch (error) {
    console.error('Dosya silme hatası:', error)
    return NextResponse.json(
      { error: 'Dosya silinirken bir hata oluştu' },
      { status: 500 }
    )
  }
}